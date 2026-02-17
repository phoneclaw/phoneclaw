
import { AgentCore } from '../agent/AgentCore';
import { loadSettings } from '../agent/settings';

// Constants
const POLLING_INTERVAL = 2000;
const EDIT_THROTTLE = 2000;

export class TelegramService {
    private token: string;
    private offset = 0;
    private activeAgents = new Map<number, AgentCore>();
    private isPolling = false;

    constructor(token: string) {
        this.token = token;
    }

    start() {
        if (this.isPolling) return;
        this.isPolling = true;
        console.log('TelegramService started...');
        this.pollLoop();
    }

    stop() {
        this.isPolling = false;
        console.log('TelegramService stopped.');
    }

    private async pollLoop() {
        while (this.isPolling) {
            try {
                const updates = await this.getUpdates(this.offset);
                if (updates && updates.length > 0) {
                    for (const update of updates) {
                        this.offset = update.update_id + 1;
                        await this.handleUpdate(update);
                    }
                }
            } catch (e) {
                console.error('Telegram polling error (retrying in 5s):', e);
                await new Promise(r => setTimeout(r, 5000));
            }
            if (!this.isPolling) break;
            await new Promise(r => setTimeout(r, POLLING_INTERVAL));
        }
    }

    private async getUpdates(offset: number): Promise<any[]> {
        const url = `https://api.telegram.org/bot${this.token}/getUpdates?offset=${offset}&timeout=10`;
        const res = await fetch(url);
        const data = await res.json();
        return data.ok ? data.result : [];
    }

    private async handleUpdate(update: any) {
        const message = update.message;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const text = message.text;
        const user = message.from?.username || message.from?.first_name || 'User';

        console.log(`[Telegram] Msg from ${user} (${chatId}): ${text}`);

        if (text.startsWith('/start')) {
            await this.sendMessage(chatId, `Hello ${user}! I am PhoneClaw. Send me a task.`);
            return;
        }

        if (text.startsWith('/abort')) {
            if (this.activeAgents.has(chatId)) {
                this.activeAgents.get(chatId)?.abort();
                this.activeAgents.delete(chatId);
                await this.sendMessage(chatId, 'ABORTED.');
            } else {
                await this.sendMessage(chatId, 'Nothing to abort.');
            }
            return;
        }

        // Run Agent
        this.runAgent(chatId, text);
    }

    private async runAgent(chatId: number, prompt: string) {
        if (this.activeAgents.has(chatId)) {
            await this.sendMessage(chatId, '⚠️ Stopping previous task.');
            this.activeAgents.get(chatId)?.abort();
            this.activeAgents.delete(chatId);
        }

        const settings = await loadSettings();
        if (!settings.apiKey) {
            await this.sendMessage(chatId, '❌ Agent not configured. Please open the app and set API Key.');
            return;
        }

        // Initial status message
        const statusMsgStart = await this.sendMessageResponse(chatId, 'Thinking...');
        if (!statusMsgStart) return;

        const messageId = statusMsgStart.message_id;

        // State for buffering updates
        let currentText = '';
        let lastEditTime = 0;
        let pendingEdit = false;

        const updateMessage = async (immediate = false) => {
            const now = Date.now();
            if (!immediate && now - lastEditTime < EDIT_THROTTLE) {
                pendingEdit = true;
                return;
            }

            lastEditTime = now;
            pendingEdit = false;

            // Format text: escape special chars if Markdown? Or just text.
            // Let's use simple text to avoid markdown errors with raw code output.
            // Telegram limit is 4096 chars.
            const displayText = currentText.length > 4000
                ? '...' + currentText.slice(-4000)
                : (currentText || '...');

            try {
                // We use basic text (no parse_mode) for safety with raw LLM output usually
                await this.editMessageRequest(chatId, messageId, displayText);
            } catch (e) {
                // If message not modified, ignore
            }
        };

        // Flush interval
        const intervalId = setInterval(() => {
            if (pendingEdit) updateMessage();
        }, EDIT_THROTTLE);

        const callbacks = {
            onThinking: () => {
                // currentText += '\n💭 ...';
                // updateMessage();
            },
            onToolCall: (name: string, params: any) => {
                currentText += `\n🛠 Executing: ${name}\n`;
                updateMessage();
            },
            onToolResult: (name: string, result: string) => {
                // Truncate result in logs
                // const short = result.length > 100 ? result.slice(0, 100) + '...' : result;
                // currentText += `\n✅ Result: ${short}\n`;
                // updateMessage();
                // Optionally show result? The user might just want the final answer.
                // The prompt says "stream the responses", usually means the thought process + final answer.
            },
            onResponse: (text: string) => {
                // Final answer usually comes via onStream if streaming is on.
                // But if not, we get it here.
                // If we relied on stream, we already have it.
            },
            onError: (error: string) => {
                currentText += `\n❌ Error: ${error}`;
                updateMessage(true);
            },
            onStream: (chunk: string) => {
                currentText += chunk;
                updateMessage();
            }
        };

        const agent = new AgentCore(settings, callbacks);
        this.activeAgents.set(chatId, agent);

        try {
            currentText = ''; // Start clean for the LLM output
            await agent.run(prompt);
            updateMessage(true); // Ensure final flush
        } catch (e: any) {
            currentText += `\n💥 System Error: ${e.message}`;
            updateMessage(true);
        } finally {
            clearInterval(intervalId);
            this.activeAgents.delete(chatId);
        }
    }

    private async sendMessageResponse(chatId: number, text: string): Promise<any> {
        return this.sendRequest('sendMessage', { chat_id: chatId, text });
    }

    private async sendMessage(chatId: number, text: string) {
        await this.sendRequest('sendMessage', { chat_id: chatId, text });
    }

    private async editMessageRequest(chatId: number, messageId: number, text: string) {
        await this.sendRequest('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text
        });
    }

    private async sendRequest(method: string, body: any): Promise<any> {
        const url = `https://api.telegram.org/bot${this.token}/${method}`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            return data.result;
        } catch (e) {
            console.warn(`TG API Error (${method}):`, e);
            return null;
        }
    }
}

// Singleton
let instance: TelegramService | null = null;

export function startTelegramService() {
    // Check global/env for token
    // Expo env vars need to be accessed via process.env.EXPO_PUBLIC_*
    const token = process.env.EXPO_PUBLIC_TELEGRAM_BOT_TOKEN;
    if (!token) {
        console.log('Skipping Telegram Service: No Token');
        return;
    }
    if (instance) return;

    instance = new TelegramService(token);
    instance.start();
}
