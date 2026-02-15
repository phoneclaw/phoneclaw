/**
 * Agent Settings — persisted via AsyncStorage, initialized from .env
 * 
 * Expo automatically reads EXPO_PUBLIC_* vars from .env files.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AgentSettings, DEFAULT_SETTINGS } from './types';

const STORAGE_KEY = 'phoneclaw_agent_settings';

/** Read env vars set via .env (Expo auto-loads EXPO_PUBLIC_* vars) */
function getEnvDefaults(): Partial<AgentSettings> {
    const env: Partial<AgentSettings> = {};
    const key = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
    if (key) env.apiKey = key;
    const url = process.env.EXPO_PUBLIC_LLM_BASE_URL;
    if (url) env.baseUrl = url;
    const model = process.env.EXPO_PUBLIC_LLM_MODEL;
    if (model) env.model = model;
    return env;
}

export async function loadSettings(): Promise<AgentSettings> {
    const envDefaults = getEnvDefaults();
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
            // Saved settings take priority, but fill gaps with env vars
            return { ...DEFAULT_SETTINGS, ...envDefaults, ...JSON.parse(raw) };
        }
    } catch (e) {
        console.warn('Failed to load settings:', e);
    }
    return { ...DEFAULT_SETTINGS, ...envDefaults };
}

export async function saveSettings(settings: AgentSettings): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        console.warn('Failed to save settings:', e);
    }
}
