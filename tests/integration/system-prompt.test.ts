import { test } from "node:test";
import assert from "node:assert/strict";
import { callModel } from "../../src/llm/index.js";
import { textOf } from "../../src/util.js";

const answerWith = async (system: string, question: string) =>
  textOf(
    await callModel({ maxTokens: 300, system, messages: [{ role: "user", content: question }] }),
  );

test("el system moldea la conducta (breve vs detallado)", async () => {
  const brief = await answerWith("Responde en UNA sola palabra.", "¿Capital de Francia?");
  const detailed = await answerWith("Responde con un párrafo detallado.", "¿Capital de Francia?");
  assert.ok(brief.length < detailed.length);
});
