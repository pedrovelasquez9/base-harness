// The harness, assembled. Importing this barrel does two things:
//   1) EVALUATES each module below, and their registerTool() calls register the
//      tools (files, guarded run_command, delegate, read_doc) in the shared registry.
//   2) re-exports the public API used by main.ts, the tests and Part II.
//
// Piece map (where each thing lives):
//   registry.ts     → tool catalog (toolHandlers + toolSchemas)
//   workspace.ts    → WORKDIR + path guard
//   prompt.ts       → repo rules (SYSTEM_PROMPT from AGENTS.md)
//   memory.ts       → working memory (trimHistory); cross-session: src/session.ts
//   tools/files.ts  → read/write/edit files
//   tools/terminal.ts → run commands (runCommand, raw)
//   guards/permissions.ts → brakes + registers guarded run_command
//   verify.ts       → run the tests (the truth)
//   loop.ts         → the agentic loop + sub-agent + delegate/read_doc

export { runAgent, runSubAgent } from "./loop.js";
export { verify, type VerificationResult } from "./verify.js";
export { trimHistory } from "./memory.js";
export { readFile, writeFile, editFile } from "./tools/files.js";
export { runCommand, type CommandResult } from "./tools/terminal.js";
export { runCommandGuarded, type ConfirmFn } from "./guards/permissions.js";
export { toolHandlers, toolSchemas, registerTool, type ToolHandler } from "./registry.js";
export { resolveInsideWorkspace, WORKDIR } from "./workspace.js";
export { SYSTEM_PROMPT } from "./prompt.js";
