import { test } from "node:test";
import assert from "node:assert/strict";
import { runCommandGuarded, type ConfirmFn } from "../src/harness/index.js";

const rejectAll: ConfirmFn = async () => false; // the human always says "no"

test("lo seguro pasa; lo peligroso se detiene", async () => {
  assert.equal((await runCommandGuarded("echo hola", 30_000, rejectAll)).exitCode, 0); // harmless
  assert.equal((await runCommandGuarded("rm -rf .", 30_000, rejectAll)).exitCode, 126); // destructive
});
