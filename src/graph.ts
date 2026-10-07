import { runAgent, runSubAgent } from "./harness/index.js";

// Maker-checker as an explicit graph: research → implement → verify → integrate.
// The checker is an independent sub-agent (its own context), not the implementer.
export async function makerChecker(task: string): Promise<string> {
  const requirements = await runSubAgent(`Investiga y lista requisitos de: ${task}`);

  for (let attempt = 0; attempt < 3; attempt++) {
    const code = await runAgent(`Implementa según estos requisitos:\n${requirements}`);
    // Fresh context → it can't cheat against itself (anti-Goodhart):
    const verdict = await runSubAgent(
      `¿Cumple estos requisitos? Responde PASS o FAIL.\n${requirements}\n${code}`,
    );
    if (verdict.includes("PASS")) return code; // edge: verified → integrate
  } // edge: FAIL → implement again
  throw new Error("maker-checker no convergió");
}
