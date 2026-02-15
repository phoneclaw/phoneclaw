/**
 * App Tools — launch apps, get current app info
 */

import ClawAccessibilityModule from '../native/ClawAccessibilityModule';
import type { Tool } from './index';

export const appTools: Tool[] = [
    {
        name: 'launchApp',
        description: 'Launch an app by its package name (e.g., "com.whatsapp")',
        parameters: [
            { name: 'packageName', type: 'string', description: 'Package name of the app to launch', required: true },
        ],
        execute: async (params) => {
            return await ClawAccessibilityModule.launchApp(params.packageName);
        },
    },
    {
        name: 'getCurrentApp',
        description: 'Get the package name and activity of the currently active app',
        parameters: [],
        execute: async () => {
            return await ClawAccessibilityModule.getCurrentApp();
        },
    },
];
