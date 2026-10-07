import { runCommand } from "./tools/terminal.js";

// VERIFICATION: the source of truth. Do the agent's project tests pass?
// (Not to be confused with verifyAll() in src/verify.ts, the unit→E2E ladder.)
export type VerificationResult = { passed: boolean; output: string };

export function verify(): VerificationResult {
  const result = runCommand("npm test");
  return { passed: result.exitCode === 0, output: result.stdout + result.stderr };
}
