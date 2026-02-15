import { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { AgentCore } from '@/src/agent/AgentCore';
import { loadSettings } from '@/src/agent/settings';
import { AgentSettings, DEFAULT_SETTINGS, UIMessage } from '@/src/agent/types';
import ClawAccessibilityModule from '@/src/native/ClawAccessibilityModule';

let msgId = Date.now();
const uid = () => String(++msgId);

export default function AgentScreen() {
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [input, setInput] = useState('');
    const [running, setRunning] = useState(false);
    const [settings, setSettings] = useState<AgentSettings>(DEFAULT_SETTINGS);
    const agentRef = useRef<AgentCore | null>(null);
    const listRef = useRef<FlatList>(null);

    useEffect(() => {
        loadSettings().then(setSettings);
    }, []);

    const addMessage = useCallback((msg: Omit<UIMessage, 'id' | 'timestamp'>) => {
        const full: UIMessage = { ...msg, id: uid(), timestamp: Date.now() };
        setMessages(prev => [...prev, full]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, []);

    const handleSend = useCallback(async () => {
        const text = input.trim();
        if (!text || running) return;

        setInput('');
        addMessage({ type: 'user', text });

        if (!settings.apiKey) {
            addMessage({ type: 'error', text: 'No API key set. Go to Settings tab first.' });
            return;
        }

        setRunning(true);

        const agent = new AgentCore(settings, {
            onThinking: () => addMessage({ type: 'status', text: '🤔 Thinking...' }),
            onToolCall: (name, params) =>
                addMessage({
                    type: 'tool_call',
                    text: `${name}(${JSON.stringify(params)})`,
                    toolName: name,
                    toolParams: params,
                }),
            onToolResult: (name, result) =>
                addMessage({
                    type: 'tool_result',
                    text: result.slice(0, 500),
                    toolName: name,
                    toolResult: result,
                }),
            onResponse: (text) => addMessage({ type: 'assistant', text }),
            onError: (error) => addMessage({ type: 'error', text: error }),
        });

        agentRef.current = agent;

        // Start foreground service to keep JS alive when app is backgrounded
        await ClawAccessibilityModule.startAgentService();

        try {
            await agent.run(text);
        } catch (e: any) {
            addMessage({ type: 'error', text: e.message || 'Unknown error' });
        }

        // Stop foreground service when done
        await ClawAccessibilityModule.stopAgentService();
        agentRef.current = null;
        setRunning(false);
    }, [input, running, settings, addMessage]);

    const handleStop = useCallback(() => {
        agentRef.current?.abort();
        ClawAccessibilityModule.stopAgentService();
    }, []);

    const renderMessage = useCallback(({ item }: { item: UIMessage }) => {
        switch (item.type) {
            case 'user':
                return (
                    <View style={[styles.bubble, styles.userBubble]}>
                        <Text style={styles.userText}>{item.text}</Text>
                    </View>
                );
            case 'assistant':
                return (
                    <View style={[styles.bubble, styles.assistantBubble]}>
                        <Text style={styles.assistantText}>{item.text}</Text>
                    </View>
                );
            case 'tool_call':
                return (
                    <View style={styles.toolCard}>
                        <Text style={styles.toolLabel}>🔧 {item.toolName}</Text>
                        <Text style={styles.toolDetail} numberOfLines={3}>
                            {JSON.stringify(item.toolParams, null, 1)}
                        </Text>
                    </View>
                );
            case 'tool_result':
                return (
                    <View style={[styles.toolCard, styles.toolResultCard]}>
                        <Text style={styles.toolResultLabel}>✅ {item.toolName} result</Text>
                        <Text style={styles.toolDetail} numberOfLines={5}>
                            {item.text}
                        </Text>
                    </View>
                );
            case 'status':
                return (
                    <View style={styles.statusRow}>
                        <Text style={styles.statusText}>{item.text}</Text>
                    </View>
                );
            case 'error':
                return (
                    <View style={[styles.bubble, styles.errorBubble]}>
                        <Text style={styles.errorText}>{item.text}</Text>
                    </View>
                );
            default:
                return null;
        }
    }, []);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🐾 PhoneClaw Agent</Text>
                {running && (
                    <Pressable style={styles.stopBtn} onPress={handleStop}>
                        <Text style={styles.stopText}>⏹ Stop</Text>
                    </Pressable>
                )}
            </View>

            {/* Messages */}
            <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyEmoji}>🐾</Text>
                        <Text style={styles.emptyTitle}>PhoneClaw Agent</Text>
                        <Text style={styles.emptySubtitle}>
                            Tell me what to do on your phone.
                        </Text>
                        <Text style={styles.emptyHint}>
                            Try: "Open Settings" or "Scroll down"
                        </Text>
                    </View>
                }
            />

            {/* Input Bar */}
            <View style={styles.inputBar}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Tell the agent what to do..."
                    placeholderTextColor="#666"
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                    editable={!running}
                />
                <Pressable
                    style={[styles.sendBtn, (!input.trim() || running) && styles.sendBtnDisabled]}
                    onPress={handleSend}
                    disabled={!input.trim() || running}
                >
                    <Text style={styles.sendText}>▶</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0A' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 56,
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: '#111',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
    stopBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: '#3A1111',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    stopText: { color: '#FF6B6B', fontWeight: '600', fontSize: 13 },
    listContent: { padding: 16, paddingBottom: 8, flexGrow: 1 },
    bubble: {
        maxWidth: '85%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#0A84FF',
        borderBottomRightRadius: 4,
    },
    userText: { color: '#fff', fontSize: 15 },
    assistantBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#1C1C1E',
        borderBottomLeftRadius: 4,
    },
    assistantText: { color: '#E5E5EA', fontSize: 15, lineHeight: 22 },
    toolCard: {
        alignSelf: 'flex-start',
        backgroundColor: '#1A1A2E',
        borderRadius: 12,
        padding: 10,
        marginBottom: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#7CB3FF',
        maxWidth: '90%',
    },
    toolResultCard: {
        borderLeftColor: '#34C759',
        backgroundColor: '#0D1A0D',
    },
    toolLabel: { color: '#7CB3FF', fontWeight: '700', fontSize: 13 },
    toolResultLabel: { color: '#34C759', fontWeight: '700', fontSize: 13 },
    toolDetail: { color: '#999', fontSize: 12, fontFamily: 'monospace', marginTop: 4 },
    statusRow: { alignItems: 'center', marginVertical: 6 },
    statusText: { color: '#666', fontSize: 13 },
    errorBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#2D1111',
        borderColor: '#FF3B30',
        borderWidth: 1,
    },
    errorText: { color: '#FF6B6B', fontSize: 14 },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
    emptySubtitle: { fontSize: 15, color: '#888', marginBottom: 16 },
    emptyHint: { fontSize: 13, color: '#555', fontStyle: 'italic' },
    inputBar: {
        flexDirection: 'row',
        padding: 12,
        paddingBottom: 28,
        backgroundColor: '#111',
        borderTopWidth: 1,
        borderTopColor: '#222',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        color: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0A84FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendBtnDisabled: { backgroundColor: '#333' },
    sendText: { color: '#fff', fontSize: 18 },
});
