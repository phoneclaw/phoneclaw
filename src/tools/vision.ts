import ClawAccessibilityModule from '../native/ClawAccessibilityModule';
import { Tool } from './index';

export const visionTools: Tool[] = [
    {
        name: 'capture_screen',
        description: 'Take a screenshot of the current screen to see what is displayed. Use this when you need to understand visual elements, icons, or layout that are not available in the UI tree. Returns a base64-encoded image.',
        parameters: [],
        execute: async () => {
            try {
                const base64 = await ClawAccessibilityModule.takeScreenshot();
                if (!base64) {
                    return 'Failed to take screenshot';
                }
                return base64; // Return the raw base64, AgentCore will handle formatting it
            } catch (e) {
                return `Error taking screenshot: ${e instanceof Error ? e.message : String(e)}`;
            }
        },
    },
];
