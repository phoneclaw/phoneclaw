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
            const result = await ClawAccessibilityModule.launchApp(params.packageName);
            // Wait for the app to load before the agent takes the next action
            await new Promise(resolve => setTimeout(resolve, 2000));
            return result;
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
