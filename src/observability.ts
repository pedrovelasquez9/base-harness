import { appendFileSync } from "node:fs";

// A per-session event stream (JSONL): a trace you can re-read without re-running.
export function logEvent(kind: string, data: { [key: string]: unknown } = {}): void {
  const event = { t: new Date().toISOString(), kind, ...data };
  appendFileSync("session.log.jsonl", JSON.stringify(event) + "\n");
}
