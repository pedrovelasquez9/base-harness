import { test } from "node:test";
import assert from "node:assert/strict";
import { callModel } from "../../src/llm/index.js";
import type { ToolSchema } from "../../src/types.js";

const tools: ToolSchema[] = [
  {
    name: "current_time",
    description: "Devuelve la fecha y hora actual en formato ISO.",
    inputSchema: { type: "object", properties: {} },
  },
];

test("el modelo pide la herramienta, no la ejecuta", async () => {
  const message = await callModel({
    maxTokens: 400,
    tools,
    messages: [{ role: "user", content: "¿Qué hora es exactamente?" }],
  });
  const toolCall = message.content.find((block) => block.type === "tool_use");
  assert.equal(message.stopReason, "tool_use");
  assert.ok(toolCall && toolCall.type === "tool_use");
  assert.equal(toolCall.name, "current_time");
});
