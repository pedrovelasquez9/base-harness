import { readFileSync, existsSync } from "node:fs";

// The repo RULES (the system prompt). They live in AGENTS.md; a tolerant fallback
// lets the harness be imported even before that file exists.
export const SYSTEM_PROMPT = existsSync("AGENTS.md")
  ? readFileSync("AGENTS.md", "utf-8")
  : "Eres un ingeniero senior, cuidadoso y conciso.";
