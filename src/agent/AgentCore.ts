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
                { role: 'system', content: buildSystemPrompt() },
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

                        // 2. Add image as a new user message
                        this.messages.push({
                            role: 'user',
                            content: [
                                { type: 'text', text: 'Here is the screen you captured:' },
                                { type: 'image_url', image_url: { url: `data:image/png;base64,${base64}` } }
                            ]
                        });
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

    /** Call the OpenAI-compatible API */
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
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                // OpenRouter-specific headers (harmless for other providers)
                'HTTP-Referer': 'https://github.com/phoneclaw/phoneclaw',
                'X-Title': 'PhoneClaw Agent',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text().catch(() => '');
            throw new Error(`API error ${res.status}: ${errorText.slice(0, 200)}`);
        }

        return res.json();
    }
}
