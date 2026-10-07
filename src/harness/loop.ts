import { readFileSync } from "node:fs";
import { callModel } from "../llm/index.js";
import { textOf, toolResult } from "../util.js";
import type { ChatMessage, ToolResult } from "../types.js";
import { toolHandlers, toolSchemas, registerTool } from "./registry.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import { trimHistory } from "./memory.js";
import { logEvent } from "../observability.js";

// THE agentic LOOP: the heart of the harness. Coordinates memory, model and tools.
type RunAgentOptions = { system?: string; maxTurns?: number };

export async function runAgent(
  prompt: string,
  { system = SYSTEM_PROMPT, maxTurns = 25 }: RunAgentOptions = {},
): Promise<string> {
  const messages: ChatMessage[] = [{ role: "user", content: prompt }]; // ← working memory

  for (let turn = 0; turn < maxTurns; turn++) {
    logEvent("turn", { n: turn });
    await trimHistory(messages);
    const message = await callModel({ maxTokens: 4096, system, tools: toolSchemas, messages });
    messages.push({ role: "assistant", content: message.content });

    if (message.stopReason !== "tool_use") {
      logEvent("stop", { stopReason: message.stopReason });
      return textOf(message);
    }

    const results: ToolResult[] = [];
    for (const block of message.content) {
      if (block.type === "tool_use") {
        logEvent("tool", { name: block.name });
        const handler = toolHandlers[block.name];
        let output: unknown;
        try {
          output = handler ? await handler(block.input) : `ERROR: unknown tool "${block.name}"`; // model asked for a tool that does not exist
        } catch (error) {
          output = `ERROR: ${String(error)}`; // a failure is feedback, not a crash
        }
        results.push(toolResult(block.id, String(output)));
      }
    }
    messages.push({ role: "user", content: results });
  }
  throw new Error("El agente no terminó dentro del límite de turnos.");
}

// SUB-AGENT: a mini-harness with its own clean context; returns only its conclusion.
export async function runSubAgent(task: string): Promise<string> {
  return runAgent(task, { system: "Haz la tarea y responde solo la conclusión, breve." });
}

// Tool "delegate": exposes the sub-agent to the main agent.
registerTool(
  {
    name: "delegate",
    description: "Delega una sub-tarea de exploración; devuelve solo la conclusión.",
    inputSchema: { type: "object", properties: { task: { type: "string" } }, required: ["task"] },
  },
  ({ task }) => runSubAgent(task as string),
);

// Tool "read_doc": topic docs from the repo, loaded on demand.
registerTool(
  {
    name: "read_doc",
    description: "Lee un documento temático de docs/ (p.ej. 'testing').",
    inputSchema: { type: "object", properties: { topic: { type: "string" } }, required: ["topic"] },
  },
  ({ topic }) => readFileSync(`docs/${String(topic)}.md`, "utf-8"),
);
