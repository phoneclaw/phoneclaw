/**
 * Touch Tools — tap, longPress, swipe
 */

import ClawAccessibilityModule from '../native/ClawAccessibilityModule';
import type { Tool } from './index';

export const touchTools: Tool[] = [
    {
        name: 'tap',
        description: 'Tap at specific screen coordinates (x, y)',
        parameters: [
            { name: 'x', type: 'number', description: 'X coordinate in pixels', required: true },
            { name: 'y', type: 'number', description: 'Y coordinate in pixels', required: true },
        ],
        execute: async (params) => {
            return await ClawAccessibilityModule.tap(params.x, params.y);
        },
    },
    {
        name: 'longPress',
        description: 'Long press at specific screen coordinates (x, y) for 500ms',
        parameters: [
            { name: 'x', type: 'number', description: 'X coordinate in pixels', required: true },
            { name: 'y', type: 'number', description: 'Y coordinate in pixels', required: true },
        ],
        execute: async (params) => {
            return await ClawAccessibilityModule.longPress(params.x, params.y);
        },
    },
    {
        name: 'swipe',
        description: 'Swipe from (x1, y1) to (x2, y2) over a given duration in ms',
        parameters: [
            { name: 'x1', type: 'number', description: 'Start X coordinate', required: true },
            { name: 'y1', type: 'number', description: 'Start Y coordinate', required: true },
            { name: 'x2', type: 'number', description: 'End X coordinate', required: true },
            { name: 'y2', type: 'number', description: 'End Y coordinate', required: true },
            { name: 'duration', type: 'number', description: 'Duration in milliseconds (default: 300)', required: false },
        ],
        execute: async (params) => {
            return await ClawAccessibilityModule.swipe(
                params.x1, params.y1,
                params.x2, params.y2,
                params.duration ?? 300
            );
        },
    },
];
