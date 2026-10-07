import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The "cold-start test": a fresh session must be able to orient itself from the repo alone.
test("AGENTS.md explica cómo arrancar y cómo verificar", () => {
  const agents = readFileSync("AGENTS.md", "utf-8");
  assert.match(agents, /npm (run )?(dev|start)/); // how to start
  assert.match(agents, /npm (run )?(test|check)/); // how to verify
});
