import { test } from "node:test";
import assert from "node:assert/strict";
import { runAgent, verify } from "../../src/harness/index.js";

// E2E: needs a provider and a project in ./workspace with its own test.
// The agent writes the code; the TRUTH is that verify() passes, not that the model says so.
test("el agente deja fizzBuzz con los tests en verde", async () => {
  await runAgent("Implementa fizzBuzz(n) en fizz.ts hasta que pasen los tests.");
  const { passed, output } = verify();
  assert.ok(passed, `los tests aún fallan:\n${output}`);
});
