import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette, radius, spacing, typography } from '@/constants/theme';
import { loadSettings, saveSettings } from '@/src/agent/settings';
import { AgentSettings, DEFAULT_SETTINGS } from '@/src/agent/types';
import ClawAccessibilityModule from '@/src/native/ClawAccessibilityModule';
import { ClawAccessibilityService } from '@/src/native/ClawAccessibilityService';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
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
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <Animated.View entering={FadeIn.duration(200)} style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
                <Pressable style={styles.closeBtn} onPress={() => router.back()}>
                    <Ionicons name="close" size={20} color={palette.textTertiary} />
                </Pressable>
            </Animated.View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Accessibility Service */}
                <Animated.View entering={FadeInDown.delay(80).duration(300)}>
                    <Text style={styles.sectionLabel}>ACCESSIBILITY SERVICE</Text>
                    <View style={styles.card}>
                        <View style={styles.statusRow}>
                            <View style={styles.statusLeft}>
                                <View style={[styles.statusDot, serviceRunning ? styles.dotOn : styles.dotOff]} />
                                <Text style={styles.statusText}>
                                    {serviceRunning ? 'Running' : 'Stopped'}
                                </Text>
                            </View>
                            <Pressable
                                style={styles.iconBtn}
                                onPress={async () => {
                                    const r = await ClawAccessibilityModule.isServiceRunning();
                                    setServiceRunning(r);
                                }}
                            >
                                <Ionicons name="refresh" size={14} color={palette.textMuted} />
                            </Pressable>
                        </View>
                        <View style={styles.divider} />
                        <Pressable
                            style={styles.actionRow}
                            onPress={() => ClawAccessibilityService.openAccessibilitySettings()}
                        >
                            <Text style={styles.actionText}>Open Accessibility Settings</Text>
                            <Ionicons name="open-outline" size={14} color={palette.textMuted} />
                        </Pressable>
                    </View>
                </Animated.View>

                {/* LLM Configuration */}
                <Animated.View entering={FadeInDown.delay(160).duration(300)}>
                    <Text style={styles.sectionLabel}>LLM CONFIGURATION</Text>
                    <View style={styles.card}>
                        <FieldRow label="API Key">
                            <TextInput
                                style={styles.input}
                                value={settings.apiKey}
                                onChangeText={v => update('apiKey', v)}
                                placeholder="sk-..."
                                placeholderTextColor={palette.textMuted}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </FieldRow>
                        <View style={styles.divider} />
                        <FieldRow label="Base URL">
                            <TextInput
                                style={styles.input}
                                value={settings.baseUrl}
                                onChangeText={v => update('baseUrl', v)}
                                placeholder="https://openrouter.ai/api/v1"
                                placeholderTextColor={palette.textMuted}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </FieldRow>
                        <View style={styles.divider} />
                        <FieldRow label="Model">
                            <TextInput
                                style={styles.input}
                                value={settings.model}
                                onChangeText={v => update('model', v)}
                                placeholder="google/gemini-2.0-flash-001"
                                placeholderTextColor={palette.textMuted}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </FieldRow>
                        <View style={styles.divider} />
                        <FieldRow label="Max Steps">
                            <TextInput
                                style={styles.input}
                                value={String(settings.maxSteps)}
                                onChangeText={v => update('maxSteps', parseInt(v) || 20)}
                                placeholder="20"
                                placeholderTextColor={palette.textMuted}
                                keyboardType="numeric"
                            />
                        </FieldRow>
                        <View style={styles.divider} />
                        <FieldRow label="Vision Capability">
                            <Pressable
                                style={[styles.toggleBtn, settings.imageCapability && styles.toggleBtnOn]}
                                onPress={() => update('imageCapability', !settings.imageCapability)}
                            >
                                <Ionicons
                                    name={settings.imageCapability ? 'eye' : 'eye-off'}
                                    size={16}
                                    color={settings.imageCapability ? palette.bg0 : palette.textMuted}
                                />
                                <Text style={[styles.toggleText, settings.imageCapability && styles.toggleTextOn]}>
                                    {settings.imageCapability ? 'Vision Enabled' : 'Vision Disabled'}
                                </Text>
                            </Pressable>
                        </FieldRow>

                        {settings.imageCapability && (
                            <Animated.View entering={FadeInDown.duration(300)}>
                                <View style={styles.divider} />
                                <FieldRow label="Image Model">
                                    <TextInput
                                        style={styles.input}
                                        value={settings.imageModel}
                                        onChangeText={v => update('imageModel', v)}
                                        placeholder="nvidia/nemotron-nano-12b-v2-vl:free"
                                        placeholderTextColor={palette.textMuted}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </FieldRow>
                            </Animated.View>
                        )}
                    </View>
                </Animated.View>

                {/* Actions */}
                <Animated.View entering={FadeInDown.delay(240).duration(300)} style={{ marginTop: spacing.xxl }}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.saveBtn,
                            saved && styles.saveBtnDone,
                            pressed && !saved && styles.saveBtnPressed,
                        ]}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveBtnText}>
                            {saved ? '✓  Saved' : 'Save Settings'}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={styles.resetBtn}
                        onPress={() =>
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
                            ])
                        }
                    >
                        <Text style={styles.resetText}>Reset to Defaults</Text>
                    </Pressable>
                </Animated.View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>PhoneClaw v1.0.0</Text>
                </View>
            </ScrollView>
        </View>
    );
}

/* ─── Field Row Component ─── */
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{label}</Text>
            {children}
        </View>
    );
}

/* ═══ Styles ═══ */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.bg0 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        height: 52,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: palette.borderLight,
    },
    headerTitle: { ...typography.title, color: palette.textPrimary },
    closeBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: palette.bg2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scroll: { flex: 1 },
    scrollContent: { padding: spacing.xl },

    sectionLabel: {
        ...typography.label,
        color: palette.textMuted,
        marginTop: spacing.xxl,
        marginBottom: spacing.sm,
        marginLeft: 2,
    },

    card: {
        backgroundColor: palette.bg2,
        borderRadius: radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: palette.borderLight,
        overflow: 'hidden',
    },

    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    statusLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    dotOn: { backgroundColor: palette.success },
    dotOff: { backgroundColor: palette.error },
    statusText: { ...typography.body, color: palette.textSecondary },
    iconBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: palette.bg3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    actionText: { ...typography.bodySm, color: palette.textSecondary },

    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: palette.border,
        marginHorizontal: spacing.lg,
    },

    fieldRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    fieldLabel: {
        ...typography.caption,
        color: palette.textMuted,
        marginBottom: spacing.xs,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: palette.bg3,
        color: palette.textPrimary,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        ...typography.body,
        fontSize: 14,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: palette.border,
    },
    toggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.bg3,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: palette.border,
        gap: spacing.sm,
    },
    toggleBtnOn: {
        backgroundColor: palette.accent,
        borderColor: palette.accent,
    },
    toggleText: {
        ...typography.bodySm,
        color: palette.textSecondary,
    },
    toggleTextOn: {
        color: palette.bg0,
        fontWeight: '600',
    },

    saveBtn: {
        backgroundColor: palette.accent,
        paddingVertical: 14,
        borderRadius: radius.md,
        alignItems: 'center',
    },
    saveBtnDone: { backgroundColor: palette.success },
    saveBtnPressed: { opacity: 0.85 },
    saveBtnText: { ...typography.subtitle, color: palette.bg0 },

    resetBtn: {
        marginTop: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: palette.borderLight,
    },
    resetText: { ...typography.bodySm, color: palette.textMuted },

    footer: { alignItems: 'center', marginTop: spacing.xxxl, paddingBottom: spacing.lg },
    footerText: { ...typography.caption, color: palette.textMuted, textTransform: 'none', letterSpacing: 0 },
});
