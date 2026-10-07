import { test } from "node:test";
import assert from "node:assert/strict";
import { endSession } from "../src/handoff.js";

test("no se cierra la sesión con tests en rojo", () => {
  const run = (cmd: string) => ({ stdout: "", stderr: "", exitCode: cmd.includes("test") ? 1 : 0 });
  const result = endSession(run, () => ["index.ts", "debug.log"]);
  assert.equal(result.clean, false);
  assert.ok(result.reasons.includes("tests en rojo"));
});
