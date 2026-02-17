/**
 * AgentCore — LLM Reasoning Loop
 * 
 * Connects the LLM to the tool registry. Sends messages in OpenAI
 * function-calling format, executes tool calls, and loops until
 * the LLM returns a final text response or hits the step limit.
 */
import ClawAccessibilityModule from '../native/ClawAccessibilityModule';
import { executeTool } from '../tools';
import { buildSystemPrompt, buildToolSchemas } from './prompts';
import {
    AgentCallbacks,
    AgentSettings,
    ChatMessage
} from './types';

export class AgentCore {
    private settings: AgentSettings;
    private callbacks: AgentCallbacks;
    private messages: ChatMessage[] = [];
    private aborted = false;

    constructor(settings: AgentSettings, callbacks: AgentCallbacks) {
        this.settings = settings;
        this.callbacks = callbacks;

        // Listen to heartbeat to keep JS bridge active during background execution
        ClawAccessibilityModule.addListener('PhoneClawHeartbeat');
    }

    /** Abort the current run */
    abort() {
        this.aborted = true;
    }

    /** Run the agent with a user message */
    async run(userMessage: string): Promise<string> {
        this.aborted = false;

        // Start foreground service to keep CPU alive
        try {
            await ClawAccessibilityModule.startAgentService();
        } catch (e) {
            console.error('Failed to start agent service', e);
        }

        try {
            // Initialize conversation
            this.messages = [
                { role: 'system', content: buildSystemPrompt(this.settings) },
                { role: 'user', content: userMessage },
            ];

            const toolSchemas = buildToolSchemas();
            let steps = 0;

            while (steps < this.settings.maxSteps) {
                if (this.aborted) {
                    return '⏹ Agent stopped by user.';
                }

                steps++;
                this.callbacks.onThinking();

                // Call LLM
                let response: any;
                try {
                    response = await this.callLLM(toolSchemas);
                } catch (error: any) {
                    const msg = error?.message || 'LLM request failed';
                    this.callbacks.onError(msg);
                    return `❌ Error: ${msg}`;
                }

                const choice = response.choices?.[0];
                if (!choice) {
                    this.callbacks.onError('No response from LLM');
                    return '❌ No response from LLM';
                }

                const assistantMessage = choice.message;

                // Add assistant message to history
                this.messages.push({
                    role: 'assistant',
                    content: assistantMessage.content || null,
                    tool_calls: assistantMessage.tool_calls,
                });

                // If no tool calls, the assistant is done
                if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
                    const finalText = assistantMessage.content || 'Done.';
                    this.callbacks.onResponse(finalText);
                    return finalText;
                }

                // Execute each tool call
                for (const toolCall of assistantMessage.tool_calls) {
                    if (this.aborted) {
                        return '⏹ Agent stopped by user.';
                    }

                    const funcName = toolCall.function.name;
                    let params: Record<string, any> = {};
                    try {
                        params = JSON.parse(toolCall.function.arguments || '{}');
                    } catch {
                        params = {};
                    }

                    this.callbacks.onToolCall(funcName, params);

                    let result: string;
                    try {
                        const rawResult = await executeTool(funcName, params);
                        result = typeof rawResult === 'string' ? rawResult : JSON.stringify(rawResult);
                    } catch (error: any) {
                        result = `Error: ${error?.message || 'Tool execution failed'}`;
                    }

                    // Special handling for screenshot to avoid cluttering logs and to pass image to LLM
                    if (funcName === 'capture_screen' && !result.startsWith('Error') && !result.startsWith('Failed')) {
                        const base64 = result;
                        result = 'Screenshot captured successfully.';
                        this.callbacks.onToolResult(funcName, result);

                        // 1. Add tool output (text)
                        this.messages.push({
                            role: 'tool',
                            content: result,
                            tool_call_id: toolCall.id,
                            name: funcName,
                        });

                        // 2. Add image as a new user message (if capability is enabled)
                        if (this.settings.imageCapability !== false) {
                            this.messages.push({
                                role: 'user',
                                content: [
                                    { type: 'text', text: 'Here is the screen you captured:' },
                                    { type: 'image_url', image_url: { url: `data:image/png;base64,${base64}` } }
                                ]
                            });
                        } else {
                            this.messages.push({
                                role: 'user',
                                content: 'Screenshot captured, but vision is disabled. I will use the UI tree to understand the screen.'
                            });
                        }
                    } else {
                        // Standard handling
                        this.callbacks.onToolResult(funcName, result);

                        this.messages.push({
                            role: 'tool',
                            content: result,
                            tool_call_id: toolCall.id,
                            name: funcName,
                        });
                    }
                }
            }

            // Hit max steps
            const maxMsg = `⚠️ Reached maximum steps (${this.settings.maxSteps}). Stopping.`;
            this.callbacks.onError(maxMsg);
            return maxMsg;
        } finally {
            // Stop foreground service
            try {
                await ClawAccessibilityModule.stopAgentService();
            } catch (e) {
                console.error('Failed to stop agent service', e);
            }
        }
    }

    /** Call the OpenAI-compatible API with streaming */
    private async callLLM(tools: any[]): Promise<any> {
        const { apiKey, baseUrl, model } = this.settings;

        if (!apiKey) {
            throw new Error('No API key configured. Go to Settings to add one.');
        }

        const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

        const body: any = {
            model,
            messages: this.messages,
            tools,
            tool_choice: 'auto',
            stream: true,
        };

        // Use custom SSE fetcher for RN
        return this.fetchSSE(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://github.com/phoneclaw/phoneclaw',
                'X-Title': 'PhoneClaw Agent',
            },
            body: JSON.stringify(body),
        });
    }

    /** 
     * Custom Fetch for SSE in React Native using XMLHttpRequest
     * Standard 'fetch' in RN doesn't support ReadableStream well yet.
     */
    private fetchSSE(url: string, options: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(options.method, url);

            for (const [key, value] of Object.entries(options.headers || {})) {
                xhr.setRequestHeader(key, value as string);
            }

            // Accumulate response
            let content = '';
            const toolCallsMap: Record<number, any> = {};
            let lastSeenIndex = 0;

            const parseChunk = (text: string) => {
                const lines = text.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith('data: ')) continue;
                    const dataStr = trimmed.slice(6);
                    if (dataStr === '[DONE]') continue;

                    try {
                        const chunk = JSON.parse(dataStr);
                        const delta = chunk.choices?.[0]?.delta;
                        if (!delta) continue;

                        // 1. Content
                        if (delta.content) {
                            content += delta.content;
                            if (this.callbacks.onStream) {
                                this.callbacks.onStream(delta.content);
                            }
                        }

                        // 2. Tool Calls
                        if (delta.tool_calls) {
                            for (const tc of delta.tool_calls) {
                                const idx = tc.index;
                                if (!toolCallsMap[idx]) {
                                    toolCallsMap[idx] = {
                                        index: idx,
                                        id: tc.id || '',
                                        type: 'function',
                                        function: { name: '', arguments: '' }
                                    };
                                }
                                const current = toolCallsMap[idx];
                                if (tc.id) current.id = tc.id;
                                if (tc.function?.name) current.function.name += tc.function.name;
                                if (tc.function?.arguments) current.function.arguments += tc.function.arguments;
                            }
                        }
                    } catch (e) {
                        // ignore json parse error
                    }
                }
            };

            xhr.onprogress = () => {
                if (this.aborted) {
                    xhr.abort();
                    reject(new Error('Aborted by user'));
                    return;
                }

                // Read new data only
                const newData = xhr.responseText.slice(lastSeenIndex);
                lastSeenIndex = xhr.responseText.length;
                parseChunk(newData);
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // Assemble final object
                    const tool_calls = Object.values(toolCallsMap).sort((a, b) => a.index - b.index);
                    resolve({
                        choices: [
                            {
                                message: {
                                    role: 'assistant',
                                    content: content || null,
                                    tool_calls: tool_calls.length > 0 ? tool_calls : undefined
                                }
                            }
                        ]
                    });
                } else {
                    reject(new Error(`API error ${xhr.status}: ${xhr.responseText.slice(0, 200)}`));
                }
            };

            xhr.onerror = () => {
                reject(new Error('Network request failed'));
            };

            xhr.send(options.body);
        });
    }
}
