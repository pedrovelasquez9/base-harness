import { test } from "node:test";
import assert from "node:assert/strict";
import { callModel } from "../../src/llm/index.js";
import { textOf } from "../../src/util.js";
import type { ChatMessage } from "../../src/types.js";

const ask = async (history: ChatMessage[]) =>
  textOf(await callModel({ maxTokens: 400, messages: history }));

test("sin historial olvida; con historial recuerda", async () => {
  const withoutMemory = await ask([{ role: "user", content: "¿Cómo me llamo?" }]);
  assert.ok(!withoutMemory.includes("Ada"));

  const history: ChatMessage[] = [
    { role: "user", content: "Me llamo Ada. Recuérdalo." },
    { role: "assistant", content: "Hecho, Ada." },
    { role: "user", content: "¿Cómo me llamo?" },
  ];
  assert.ok((await ask(history)).includes("Ada"));
});
