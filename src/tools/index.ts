/**
 * PhoneClaw Tool Registry
 * 
 * Central registry for all agent tools. Each tool has:
 * - name: unique identifier
 * - description: what the tool does (sent to LLM)
 * - parameters: JSON schema of accepted params
 * - execute: async function that performs the action
 */

import { appTools } from './app';
import { inputTools } from './input';
import { navigationTools } from './navigation';
import { screenTools } from './screen';
import { touchTools } from './touch';

export interface ToolParameter {
    name: string;
    type: 'string' | 'number' | 'boolean';
    description: string;
    required: boolean;
}

export interface Tool {
    name: string;
    description: string;
    parameters: ToolParameter[];
    execute: (params: Record<string, any>) => Promise<any>;
}

// All available tools
const allTools: Tool[] = [
    ...touchTools,
    ...navigationTools,
    ...screenTools,
    ...inputTools,
    ...appTools,
];

// Quick lookup by name
const toolMap = new Map<string, Tool>();
allTools.forEach(tool => toolMap.set(tool.name, tool));

export function getTool(name: string): Tool | undefined {
    return toolMap.get(name);
}

export function getAllTools(): Tool[] {
    return allTools;
}

export function getToolDescriptions(): Array<{ name: string; description: string; parameters: ToolParameter[] }> {
    return allTools.map(t => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters,
    }));
}

export async function executeTool(name: string, params: Record<string, any>): Promise<any> {
    const tool = toolMap.get(name);
    if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
    }
    return tool.execute(params);
}
