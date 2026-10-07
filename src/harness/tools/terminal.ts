import { spawnSync } from "node:child_process";
import { WORKDIR } from "../workspace.js";

// Terminal TOOL: the most powerful (run tests, git, install) and the most dangerous.
// Captures stdout/stderr/exitCode and honors a timeout. The "run_command" tool is
// NOT registered here: it is registered in guards/permissions.ts (the guarded version).
export type CommandResult = { stdout: string; stderr: string; exitCode: number };

export function runCommand(command: string, timeoutMs = 30_000): CommandResult {
  const result = spawnSync(command, {
    shell: true,
    cwd: WORKDIR,
    encoding: "utf-8",
    timeout: timeoutMs,
  });
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    exitCode: result.status ?? -1,
  };
}
