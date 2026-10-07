import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { logEvent } from "../src/observability.js";

test("el log captura las llamadas a herramientas", () => {
  logEvent("tool", { name: "run_command" });
  const lines = readFileSync("session.log.jsonl", "utf-8").trim().split("\n");
  const last = JSON.parse(lines[lines.length - 1]);
  assert.equal(last.kind, "tool");
  assert.equal(last.name, "run_command");
});
