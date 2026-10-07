import { MODEL, API_KEY } from "../config.js";
import type { ContentBlock, LlmProvider } from "../types.js";

// Anthropic provider: native format, so it barely translates.
export function createAnthropicProvider(): LlmProvider {
  // Lazy load: only the active provider's SDK is imported.
  // apiKey ?? "unset" keeps the constructor from throwing without a key (only the real call needs one).
  const clientReady = import("@anthropic-ai/sdk").then(
    ({ default: Anthropic }) => new Anthropic({ apiKey: API_KEY ?? "unset" }),
  );
  return {
    async complete({ messages, system, tools, maxTokens = 4096 }) {
      const client = await clientReady;
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        tools: tools?.map((tool) => ({
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
        })) as any,
        messages: messages as any,
      });
      return {
        content: response.content as ContentBlock[],
        stopReason: response.stop_reason ?? "end_turn",
      };
    },
    async countTokens(messages) {
      const client = await clientReady;
      const { input_tokens } = await client.messages.countTokens({
        model: MODEL,
        messages: messages as any,
      });
      return input_tokens;
    },
  };
}
