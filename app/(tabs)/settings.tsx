import { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { loadSettings, saveSettings } from '@/src/agent/settings';
import { AgentSettings, DEFAULT_SETTINGS } from '@/src/agent/types';
import ClawAccessibilityModule from '@/src/native/ClawAccessibilityModule';
import { ClawAccessibilityService } from '@/src/native/ClawAccessibilityService';

export default function SettingsScreen() {
    const [settings, setSettings] = useState<AgentSettings>(DEFAULT_SETTINGS);
    const [saved, setSaved] = useState(false);
    const [serviceRunning, setServiceRunning] = useState(false);

    useEffect(() => {
        loadSettings().then(setSettings);
        ClawAccessibilityModule.isServiceRunning().then(setServiceRunning);
    }, []);

    const handleSave = async () => {
        await saveSettings(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const update = (key: keyof AgentSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>⚙️ Settings</Text>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                {/* Service Status */}
                <Text style={styles.sectionTitle}>ACCESSIBILITY SERVICE</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Status</Text>
                        <Text style={[styles.statusBadge, serviceRunning ? styles.statusOn : styles.statusOff]}>
                            {serviceRunning ? '● Running' : '○ Stopped'}
                        </Text>
                    </View>
                    <Pressable
                        style={styles.actionBtn}
                        onPress={() => {
                            ClawAccessibilityService.openAccessibilitySettings();
                        }}
                    >
                        <Text style={styles.actionBtnText}>Open Accessibility Settings</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.actionBtn, { marginTop: 8 }]}
                        onPress={async () => {
                            const result = await ClawAccessibilityModule.isServiceRunning();
                            setServiceRunning(result);
                        }}
                    >
                        <Text style={styles.actionBtnText}>Refresh Status</Text>
                    </Pressable>
                </View>

                {/* API Config */}
                <Text style={styles.sectionTitle}>LLM CONFIGURATION</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>API Key</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.apiKey}
                        onChangeText={v => update('apiKey', v)}
                        placeholder="sk-... or your OpenRouter key"
                        placeholderTextColor="#555"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={[styles.label, { marginTop: 14 }]}>Base URL</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.baseUrl}
                        onChangeText={v => update('baseUrl', v)}
                        placeholder="https://openrouter.ai/api/v1"
                        placeholderTextColor="#555"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={[styles.label, { marginTop: 14 }]}>Model</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.model}
                        onChangeText={v => update('model', v)}
                        placeholder="google/gemini-2.0-flash-001"
                        placeholderTextColor="#555"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={[styles.label, { marginTop: 14 }]}>Max Steps per Task</Text>
                    <TextInput
                        style={styles.input}
                        value={String(settings.maxSteps)}
                        onChangeText={v => update('maxSteps', parseInt(v) || 20)}
                        placeholder="20"
                        placeholderTextColor="#555"
                        keyboardType="numeric"
                    />
                </View>

                {/* Save Button */}
                <Pressable
                    style={[styles.saveBtn, saved && styles.saveBtnSaved]}
                    onPress={handleSave}
                >
                    <Text style={styles.saveBtnText}>{saved ? '✓ Saved!' : 'Save Settings'}</Text>
                </Pressable>

                {/* Reset */}
                <Pressable
                    style={styles.resetBtn}
                    onPress={() => {
                        Alert.alert('Reset Settings', 'Restore all defaults?', [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Reset',
                                style: 'destructive',
                                onPress: () => {
                                    setSettings({ ...DEFAULT_SETTINGS });
                                    saveSettings(DEFAULT_SETTINGS);
                                },
                            },
                        ]);
                    }}
                >
                    <Text style={styles.resetBtnText}>Reset to Defaults</Text>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0A' },
    header: {
        paddingTop: 56,
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: '#111',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
    scroll: { flex: 1 },
    scrollContent: { padding: 16 },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#666',
        marginTop: 20,
        marginBottom: 8,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#151515',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#222',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: { color: '#aaa', fontSize: 13, fontWeight: '600', marginBottom: 6 },
    statusBadge: { fontSize: 13, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusOn: { color: '#34C759', backgroundColor: '#0D1A0D' },
    statusOff: { color: '#FF3B30', backgroundColor: '#2D1111' },
    input: {
        backgroundColor: '#1A1A1A',
        color: '#fff',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#333',
    },
    actionBtn: {
        backgroundColor: '#1A1A2E',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    actionBtnText: { color: '#7CB3FF', fontWeight: '600', fontSize: 14 },
    saveBtn: {
        marginTop: 24,
        backgroundColor: '#0A84FF',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveBtnSaved: { backgroundColor: '#34C759' },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    resetBtn: {
        marginTop: 12,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    resetBtnText: { color: '#666', fontWeight: '600', fontSize: 14 },
});
