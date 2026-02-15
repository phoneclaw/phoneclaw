/**
 * Agent Types
 */

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ToolCallFunction {
    name: string;
    arguments: string; // JSON string
}

export interface ToolCall {
    id: string;
    type: 'function';
    function: ToolCallFunction;
}

export interface TextPart {
    type: 'text';
    text: string;
}

export interface ImagePart {
    type: 'image_url';
    image_url: {
        url: string;
    };
}

export type MessageContent = string | (TextPart | ImagePart)[];

export interface ChatMessage {
    role: MessageRole;
    content: MessageContent | null;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
    name?: string;
}

/** What we show in the chat UI */
export interface UIMessage {
    id: string;
    type: 'user' | 'assistant' | 'tool_call' | 'tool_result' | 'status' | 'error';
    text: string;
    toolName?: string;
    toolParams?: Record<string, any>;
    toolResult?: string;
    timestamp: number;
}

export interface AgentSettings {
    apiKey: string;
    baseUrl: string;
    model: string;
    maxSteps: number;
    safetyConfirmation: boolean;
}

export const DEFAULT_SETTINGS: AgentSettings = {
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'stepfun/step-3.5-flash:free',
    maxSteps: 20,
    safetyConfirmation: true,
};

export interface AgentCallbacks {
    onThinking: () => void;
    onToolCall: (name: string, params: Record<string, any>) => void;
    onToolResult: (name: string, result: string) => void;
    onResponse: (text: string) => void;
    onError: (error: string) => void;
}
