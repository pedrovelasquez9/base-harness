import type { AssistantMessage, ToolResult } from "./types.js";

// Collects only the text blocks from a model response.
export function textOf(message: AssistantMessage): string {
  let text = "";
  for (const block of message.content) if (block.type === "text") text += block.text;
  return text;
}

// Builds a tool-result block (so callers never write the format keys by hand).
export function toolResult(toolUseId: string, output: string): ToolResult {
  return { type: "tool_result", tool_use_id: toolUseId, content: output };
}
