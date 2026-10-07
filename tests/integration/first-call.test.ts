import { test } from "node:test";
import assert from "node:assert/strict";
import { callModel } from "../../src/llm/index.js";

// Integration: calls the model. Needs a configured provider (Ollama or Anthropic).
test("la respuesta es una lista de bloques con tipo", async () => {
  const message = await callModel({
    maxTokens: 200,
    messages: [{ role: "user", content: "Di 'hola cerebro' y nada más." }],
  });
  assert.ok(Array.isArray(message.content));
  assert.equal(message.content[0].type, "text");
  assert.equal(message.stopReason, "end_turn");
});
