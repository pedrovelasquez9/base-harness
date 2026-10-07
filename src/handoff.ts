import { readdirSync } from "node:fs";
import { runCommand } from "./harness/index.js";

// A session closes only if it leaves the repo verifiably clean (build + tests + no temp files).
export function endSession(
  run = runCommand,
  listFiles = () => readdirSync("."),
): { clean: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (run("npm run build").exitCode !== 0) reasons.push("build falla");
  if (run("npm test").exitCode !== 0) reasons.push("tests en rojo");
  if (listFiles().some((name) => name.endsWith(".tmp") || name.startsWith("debug")))
    reasons.push("artefactos temporales");
  return { clean: reasons.length === 0, reasons };
}
