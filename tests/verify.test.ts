import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyAll } from "../src/verify.js";

test("la verificación se detiene en la primera capa roja", () => {
  const calls: string[] = [];
  const run = (cmd: string) => {
    calls.push(cmd);
    return { stdout: "", stderr: "", exitCode: cmd.includes("integration") ? 1 : 0 };
  };
  assert.equal(verifyAll(run), false);
  assert.ok(!calls.some((cmd) => cmd.includes("e2e"))); // never reached E2E
});
