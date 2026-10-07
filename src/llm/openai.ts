import { MODEL, API_KEY, BASE_URL } from "../config.js";
import type { LlmProvider } from "../types.js";
import { toOpenAiTool, toOpenAiMessages, fromOpenAiResponse } from "./translate.js";

// Provider for any OpenAI-compatible server (Ollama, OpenRouter).
// Format translation lives in translate.js; here we only talk to the API.
export function createOpenAiCompatibleProvider(): LlmProvider {
  const clientReady = import("openai").then(
    ({ default: OpenAI }) => new OpenAI({ apiKey: API_KEY ?? "unset", baseURL: BASE_URL }),
  );
  return {
    async complete({ messages, system, tools, maxTokens }) {
      const client = await clientReady;
      const response = await client.chat.completions.create({
        model: MODEL,
        max_tokens: maxTokens,
        messages: toOpenAiMessages(messages, system),
        tools: tools?.map(toOpenAiTool),
      });
      return fromOpenAiResponse(response);
    },
    // These servers have no token-count endpoint: approximate ~4 characters per token.
    async countTokens(messages) {
      return Math.ceil(JSON.stringify(messages).length / 4);
    },
  };
}
