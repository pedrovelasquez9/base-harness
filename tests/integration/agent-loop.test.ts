import { test } from "node:test";
import assert from "node:assert/strict";
import { runAgent } from "../../src/harness/index.js";

test("el bucle encadena herramientas hasta terminar", async () => {
  const reply = await runAgent("Dame la hora actual y dime si el segundo es par o impar.");
  // To answer that, it HAD to call a tool and read the result.
  assert.match(reply, /par|impar/i);
});
