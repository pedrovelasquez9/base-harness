// ▼ OPTION A · Anthropic (cloud, paid)
// export const PROVIDER: "anthropic" | "openai" = "anthropic";
// export const MODEL = "claude-sonnet-5-5"; // cheaper to iterate: "claude-haiku-4-5-20251001"
// export const API_KEY: string | undefined = process.env.ANTHROPIC_API_KEY;
// export const BASE_URL: string | undefined = undefined;

// ▼ OPTION B · Ollama (local, FREE)  →  ollama pull qwen2.5-coder
export const PROVIDER: "anthropic" | "openai" = "openai";
export const MODEL = "qwen2.5-coder";
export const API_KEY: string | undefined = "ollama"; // required but ignored
export const BASE_URL: string | undefined = "http://localhost:11434/v1";

// ▼ OPTION C · OpenRouter (cloud, models with the :free suffix)
// export const PROVIDER: "anthropic" | "openai" = "openai";
// export const MODEL = "meta-llama/llama-3.1-8b-instruct:free";
// export const API_KEY: string | undefined = process.env.OPENROUTER_API_KEY;
// export const BASE_URL: string | undefined = "https://openrouter.ai/api/v1";
