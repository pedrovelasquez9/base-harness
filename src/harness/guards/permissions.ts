import { createInterface } from "node:readline/promises";
import { runCommand, type CommandResult } from "../tools/terminal.js";
import { registerTool } from "../registry.js";

// Permission GUARD: stops destructive actions by asking the human to confirm.
// Golden rule: what the agent reads (files, command output) is data, not commands.
const DANGEROUS_PATTERNS = ["rm ", "rmdir", "del ", "format", "git push", ">", "curl "];

export type ConfirmFn = (command: string) => Promise<boolean>;

async function askConfirmation(command: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`⚠  ejecutar '${command}'? (s/N) `);
  rl.close();
  return answer.trim().toLowerCase() === "s";
}

export async function runCommandGuarded(
  command: string,
  timeoutMs = 30_000,
  confirm: ConfirmFn = askConfirmation, // injectable, so tests can stub it
): Promise<CommandResult> {
  // Substring filter: simple but bypassable. In production, use an allowlist.
  const isDangerous = DANGEROUS_PATTERNS.some((pattern) => command.includes(pattern));
  if (isDangerous && !(await confirm(command)))
    return { stdout: "", stderr: "bloqueado por el usuario", exitCode: 126 };
  return runCommand(command, timeoutMs);
}

// The terminal is ALWAYS exposed guarded (never the raw version).
registerTool(
  {
    name: "run_command",
    description: "Ejecuta un comando de shell (con permisos); devuelve stdout, stderr y exitCode.",
    inputSchema: {
      type: "object",
      properties: { command: { type: "string" } },
      required: ["command"],
    },
  },
  ({ command }) => runCommandGuarded(command as string),
);
