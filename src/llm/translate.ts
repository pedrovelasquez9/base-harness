import type { ChatMessage, ContentBlock, ToolSchema, AssistantMessage } from "../types.js";

// Private translators for the OpenAI-compatible provider: neutral shape ⇄ OpenAI shape.
// Kept here so openai.ts only talks to the API and never mixes in translation.

export function toOpenAiTool(tool: ToolSchema) {
  return {
    type: "function" as const,
    function: { name: tool.name, description: tool.description, parameters: tool.inputSchema },
  };
}

export function toOpenAiMessages(messages: ChatMessage[], system?: string): any[] {
  const result: any[] = [];
  if (system) result.push({ role: "system", content: system });
  for (const message of messages) result.push(...translateMessage(message));
  return result;
}

function translateMessage(message: ChatMessage): any[] {
  if (typeof message.content === "string")
    return [{ role: message.role, content: message.content }];
  const blocks = message.content as any[];

  // A user turn carrying tool results → one OpenAI "tool" message per result.
  if (message.role === "user")
    return blocks.map((block) => ({
      role: "tool",
      tool_call_id: block.tool_use_id,
      content: block.content,
    }));

  // An assistant turn → its text plus the tools it requested.
  let text = "";
  const toolCalls: any[] = [];
  for (const block of blocks) {
    if (block.type === "text") text += block.text;
    if (block.type === "tool_use")
      toolCalls.push({
        id: block.id,
        type: "function",
        function: { name: block.name, arguments: JSON.stringify(block.input) },
      });
  }
  const assistant: any = { role: "assistant", content: text || null };
  if (toolCalls.length > 0) assistant.tool_calls = toolCalls;
  return [assistant];
}

// Some models (e.g. qwen2.5-coder on Ollama) emit a tool call as plain JSON text
// instead of a structured tool_calls field. Recover it so the loop can still dispatch.
function recoverTextToolCall(text: string): ContentBlock | null {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  if (!trimmed.startsWith("{")) return null;
  let parsed: any;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return null;
  }
  const name = parsed?.name;
  const input = parsed?.arguments ?? parsed?.parameters ?? {};
  if (typeof name !== "string" || typeof input !== "object" || input === null) return null;
  return { type: "tool_use", id: `call_${Math.random().toString(36).slice(2)}`, name, input };
}

export function fromOpenAiResponse(response: any): AssistantMessage {
  const choice = response.choices[0];
  const content: ContentBlock[] = [];
  const toolCalls = choice.message.tool_calls ?? [];

  if (choice.message.content) {
    // Prefer structured tool_calls; only try to recover a text-encoded call when none came.
    const recovered = toolCalls.length === 0 ? recoverTextToolCall(choice.message.content) : null;
    content.push(recovered ?? { type: "text", text: choice.message.content });
  }
  for (const call of toolCalls)
    content.push({
      type: "tool_use",
      id: call.id,
      name: call.function.name,
      input: JSON.parse(call.function.arguments || "{}"),
    });

  // Some servers (Ollama) return finish_reason "stop" even when a tool was requested;
  // we infer tool_use from the presence of blocks, not from finish_reason.
  const wantsTool = content.some((block) => block.type === "tool_use");
  return { content, stopReason: wantsTool ? "tool_use" : "end_turn" };
}
