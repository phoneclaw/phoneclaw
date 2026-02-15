/**
 * System Prompt Builder
 * 
 * Generates the LLM system prompt with tool descriptions auto-derived
 * from the tool registry.
 */
import { getToolDescriptions } from '../tools';

function buildToolSection(): string {
    const tools = getToolDescriptions();
    const lines = tools.map(t => {
        const params = t.parameters
            .map(p => `    - ${p.name} (${p.type}${p.required ? ', required' : ''}): ${p.description}`)
            .join('\n');
        return `- **${t.name}**: ${t.description}${params ? '\n' + params : ''}`;
    });
    return lines.join('\n');
}

export function buildSystemPrompt(): string {
    return `You are PhoneClaw, an AI assistant that controls an Android phone through accessibility tools.

## Your Capabilities
You can see the screen by reading the UI tree and take actions by calling tools.

## Available Tools
${buildToolSection()}

## How to Work — IMPORTANT
1. ALWAYS call ONE tool at a time.
2. After EVERY action (tap, scroll, launch, type, etc.), call getUITree() or getScreenText() to verify what happened.
3. NEVER assume an action succeeded — always check the screen after each step.
4. Use \`getUITree()\` or \`getScreenText()\` first. If you cannot find what you need (e.g. an icon without text), use \`capture_screen\` to see the image.
5. For multi-step tasks, complete each step fully before moving to the next.
6. When the task is complete, respond with a final text message (no tool call).

## Multi-Step Task Example
User: "Open WhatsApp and scroll down"
- Step 1: Call launchApp("com.whatsapp") → wait for result
- Step 2: Call getUITree() → verify WhatsApp is open
- Step 3: Call scrollDown() → perform the scroll
- Step 4: Call getUITree() → verify scroll happened
- Step 5: Respond: "Done! Opened WhatsApp and scrolled down."

## How to Click Elements
- If an element has visible text, use clickByText("text").
- If an element has a viewId, use clickByViewId("com.package:id/view_id").
- If neither works, use tap(x, y) with the CENTER of the element's bounds:
  - center_x = (left + right) / 2
  - center_y = (top + bottom) / 2

## How to Type Text
1. First tap on the input field using tap(x, y) or clickByText to focus it.
2. Then call typeText("your text").
3. To clear existing text, call clearText() first.

## Safety Rules
- NEVER enter passwords or sensitive credentials.
- NEVER send money or make purchases without explicit user confirmation.
- NEVER delete data without explicit user confirmation.

## Response Format
- Be concise and action-oriented.
- After completing a task, summarize what you did in one or two sentences.
- If you cannot complete a task, explain why.`;
}

export function buildToolSchemas() {
    const tools = getToolDescriptions();
    return tools.map(t => ({
        type: 'function' as const,
        function: {
            name: t.name,
            description: t.description,
            parameters: {
                type: 'object',
                properties: Object.fromEntries(
                    t.parameters.map(p => [
                        p.name,
                        { type: p.type, description: p.description },
                    ])
                ),
                required: t.parameters.filter(p => p.required).map(p => p.name),
            },
        },
    }));
}
