import { test } from "node:test";
import assert from "node:assert/strict";
import { runCommand } from "../src/harness/index.js";

test("captura stdout y el código de salida", () => {
  const ok = runCommand("echo hola");
  assert.equal(ok.stdout.trim(), "hola");
  assert.equal(ok.exitCode, 0);

  const failed = runCommand('node -e "process.exit(3)"');
  assert.equal(failed.exitCode, 3); // the error stays visible, not lost
});
