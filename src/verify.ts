import { runCommand } from "./harness/index.js";

// Layered verification: unit → integration → E2E, stopping at the first red layer.
// The runner is a parameter so tests can inject it.
export function verifyAll(run = runCommand): boolean {
  for (const layer of ["test:unit", "test:integration", "test:e2e"]) {
    if (run(`npm run ${layer}`).exitCode !== 0) return false;
  }
  return true;
}
