import type { ChatMessage, CompletionRequest, AssistantMessage } from "../types.js";
import { provider } from "./registry.js";

// The adapter's public API (textOf/toolResult live in util.ts).
// The rest of the harness imports only from here: it never touches a concrete provider.
export function callModel(request: CompletionRequest): Promise<AssistantMessage> {
  return provider.complete(request);
}

export function countTokens(messages: ChatMessage[]): Promise<number> {
  return provider.countTokens(messages);
}
