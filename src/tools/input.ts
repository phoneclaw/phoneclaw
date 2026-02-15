/**
 * Input Tools — text input, clicking elements
 */

import ClawAccessibilityModule from '../native/ClawAccessibilityModule';
import type { Tool } from './index';

export const inputTools: Tool[] = [
    {
        name: 'typeText',
        description: 'Type text into the currently focused input field. The field must already be focused.',
        parameters: [
            { name: 'text', type: 'string', description: 'The text to type', required: true },
        ],
        execute: async (params) => {
            return await ClawAccessibilityModule.typeText(params.text);
        },
    },
    {
        name: 'clearText',
        description: 'Clear the text in the currently focused input field',
        parameters: [],
        execute: async () => {
            return await ClawAccessibilityModule.clearText();
        },
    },
    {
        name: 'clickByText',
        description: 'Find and click the first clickable element containing the specified text',
        parameters: [
            { name: 'text', type: 'string', description: 'Text to search for on screen', required: true },
        ],
        execute: async (params) => {
            return await ClawAccessibilityModule.clickByText(params.text);
        },
    },
    {
        name: 'clickByViewId',
        description: 'Click an element by its resource ID (e.g., "com.whatsapp:id/send")',
        parameters: [
            { name: 'viewId', type: 'string', description: 'Full resource ID of the element', required: true },
        ],
        execute: async (params) => {
            return await ClawAccessibilityModule.clickByViewId(params.viewId);
        },
    },
];
