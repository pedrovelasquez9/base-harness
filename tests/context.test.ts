import { test } from "node:test";
import assert from "node:assert/strict";
import { trimHistory } from "../src/harness/index.js";
import type { ChatMessage } from "../src/types.js";

// Injected deterministic counter: number of characters (offline, no model).
const countChars = async (messages: ChatMessage[]) => JSON.stringify(messages).length;

test("recortar deja el historial dentro del límite", async () => {
  const long: ChatMessage[] = [{ role: "user", content: "palabra ".repeat(2000) }];
  const history: ChatMessage[] = Array(10).fill(long[0]);
  const before = await countChars(history);
  await trimHistory(history, 5000, 2, countChars);
  assert.ok((await countChars(history)) < before); // fits again
});
