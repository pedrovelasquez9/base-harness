import { test } from "node:test";
import assert from "node:assert/strict";
import { runSubAgent } from "../../src/harness/index.js";

test("el sub-agente devuelve solo su conclusión", async () => {
  const answer = await runSubAgent("Suma 2+2 y responde solo el número.");
  assert.ok(answer.includes("4")); // the parent only sees "4", not the child's reasoning
});
