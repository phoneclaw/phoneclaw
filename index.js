import 'expo-router/entry';
import './src/agent/HeadlessTask';
import { startTelegramService } from './src/services/TelegramService';

// Start Telegram Bot
startTelegramService();

