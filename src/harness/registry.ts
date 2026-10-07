import type { ToolSchema, JsonObject } from "../types.js";

// The tool REGISTRY: the shared catalog the model sees (schemas) and the map of
// functions that run them (handlers). Each tool registers itself here from its
// own file via registerTool().
export type ToolHandler = (input: JsonObject) => unknown | Promise<unknown>;

export const toolHandlers: { [name: string]: ToolHandler } = {};
export const toolSchemas: ToolSchema[] = [];

// Registers (or replaces) a tool in a single place.
export function registerTool(schema: ToolSchema, handler: ToolHandler): void {
  toolHandlers[schema.name] = handler;
  if (!toolSchemas.some((existing) => existing.name === schema.name)) toolSchemas.push(schema);
}
