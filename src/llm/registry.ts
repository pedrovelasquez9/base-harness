import { PROVIDER } from "../config.js";
import type { LlmProvider } from "../types.js";
import { createAnthropicProvider } from "./anthropic.js";
import { createOpenAiCompatibleProvider } from "./openai.js";

// Registry + selection: adding a provider = adding one entry (Open/Closed).
const PROVIDER_FACTORIES: { [name: string]: () => LlmProvider } = {
  anthropic: createAnthropicProvider,
  openai: createOpenAiCompatibleProvider,
};

const factory = PROVIDER_FACTORIES[PROVIDER];
if (!factory) throw new Error(`Unknown PROVIDER "${PROVIDER}" — check config.ts`);

// The active provider, chosen once from config.ts.
export const provider: LlmProvider = factory();
