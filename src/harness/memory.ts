import { countTokens } from "../llm/index.js";
import type { ChatMessage } from "../types.js";

// WORKING MEMORY (within a session): the history is the `messages` array that
// lives in the loop (loop.ts); here we trim it so it never blows past the context
// window. CROSS-session memory lives apart, in src/session.ts.
export async function trimHistory(
  messages: ChatMessage[],
  limit = 150_000,
  keep = 6,
  count = countTokens, // injectable: tests pass a deterministic counter
): Promise<ChatMessage[]> {
  while ((await count(messages)) > limit && messages.length > keep) messages.shift();
  return messages;
}
