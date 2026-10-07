import { readFileSync, writeFileSync, existsSync } from "node:fs";

// CROSS-session memory (unlike the history, which lives within a single session).
const PROGRESS = "PROGRESS.md";

export function loadProgress(): string {
  return existsSync(PROGRESS) ? readFileSync(PROGRESS, "utf-8") : "";
}

export function saveProgress(state: string): void {
  writeFileSync(PROGRESS, state, "utf-8");
}
