import ClawAccessibilityModule from '../native/ClawAccessibilityModule';
import { Tool } from './index';

export const notificationTools: Tool[] = [
    {
        name: 'get_recent_notifications',
        description: 'Get a list of recent notifications posted to the phone. Returns title, text, and package name for each.',
        parameters: [
            {
                name: 'limit',
                type: 'number',
                description: 'Maximum number of notifications to retrieve (default 10)',
                required: false,
            }
        ],
        execute: async ({ limit = 10 }) => {
            try {
                const notifications = await ClawAccessibilityModule.getRecentNotifications(limit);
                if (notifications.length === 0) {
                    return 'No recent notifications found.';
                }
                return JSON.stringify(notifications.map(n => ({
                    app: n.packageName,
                    time: new Date(n.postTime).toLocaleTimeString(),
                    title: n.title,
                    message: n.text,
                    id: n.key
                })), null, 2);
            } catch (e) {
                return `Error getting notifications: ${e instanceof Error ? e.message : String(e)}`;
            }
        },
    },
    {
        name: 'click_notification',
        description: 'Tap on a notification to open it. Requires the "id" from get_recent_notifications.',
        parameters: [
            {
                name: 'id',
                type: 'string',
                description: 'The unique key/id of the notification to click',
                required: true,
            }
        ],
        execute: async ({ id }) => {
            try {
                const success = await ClawAccessibilityModule.clickNotification(id);
                return success ? 'Clicked notification.' : 'Failed to click notification (it might not be clickable or is gone).';
            } catch (e) {
                return `Error clicking notification: ${e instanceof Error ? e.message : String(e)}`;
            }
        },
    },
    {
        name: 'clear_notifications',
        description: 'Clear all notifications from the list and try to dismiss them from the status bar.',
        parameters: [],
        execute: async () => {
            const success = await ClawAccessibilityModule.clearNotifications();
            return success ? 'Notifications cleared.' : 'Failed to clear some notifications.';
        },
    },
];
