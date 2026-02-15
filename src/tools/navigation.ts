/**
 * Navigation Tools — system actions, scrolling
 */

import ClawAccessibilityModule from '../native/ClawAccessibilityModule';
import type { Tool } from './index';

export const navigationTools: Tool[] = [
    {
        name: 'pressBack',
        description: 'Press the Android back button',
        parameters: [],
        execute: async () => {
            return await ClawAccessibilityModule.pressBack();
        },
    },
    {
        name: 'pressHome',
        description: 'Press the Android home button to go to the home screen',
        parameters: [],
        execute: async () => {
            return await ClawAccessibilityModule.pressHome();
        },
    },
    {
        name: 'openRecents',
        description: 'Open the recent apps / task switcher',
        parameters: [],
        execute: async () => {
            return await ClawAccessibilityModule.openRecents();
        },
    },
    {
        name: 'openNotifications',
        description: 'Pull down the notification shade',
        parameters: [],
        execute: async () => {
            return await ClawAccessibilityModule.openNotifications();
        },
    },
    {
        name: 'scrollUp',
        description: 'Scroll the current screen upward',
        parameters: [],
        execute: async () => {
            return await ClawAccessibilityModule.scrollUp();
        },
    },
    {
        name: 'scrollDown',
        description: 'Scroll the current screen downward',
        parameters: [],
        execute: async () => {
            return await ClawAccessibilityModule.scrollDown();
        },
    },
];
