import { createInterface } from "node:readline/promises";
import { runAgent, verify } from "./harness/index.js";
import { loadProgress, saveProgress } from "./session.js";
import { endSession } from "./handoff.js";
import { makerChecker } from "./graph.js";
import { verifyAll } from "./verify.js";
import { nextFeature, verifyFeature, listFeatures } from "./features.js";

// Entry point: the only file with top-level side effects. It wires the whole harness:
//   texto           → runAgent (bucle normal) + verify + progreso
//   /next /features → modo dirigido por la lista de features (WIP=1)
//   /checker <t>    → estrategia maker-checker (un agente hace, otro revisa)
//   /check          → escalera de verificación unidad → integración → E2E
const rl = createInterface({ input: process.stdin, output: process.stdout });
console.log(
  "Comandos: una tarea en texto · /next (siguiente feature) · /features (lista) · " +
    "/checker <tarea> (hacer+revisar) · /check (escalera de tests). Enter vacío para salir.",
);

const ask = (): Promise<string | null> =>
  new Promise((resolve) => {
    rl.question("\ntask> ").then(resolve, () => resolve(null));
    rl.once("close", () => resolve(null));
  });

// CROSS-session memory: resume whatever the previous session wrote down.
const previous = loadProgress();
if (previous) console.log(`\nRetomando sesión anterior:\n${previous}\n`);

for (;;) {
  const line = await ask();
  if (!line) break; // null (stdin cerrado) o línea vacía → salimos

  if (line.startsWith("/checker ")) {
    // maker-checker: an agent implements, another checks.
    try {
      console.log(await makerChecker(line.slice("/checker ".length).trim()));
    } catch (error) {
      console.log(`maker-checker no convergió: ${String(error)}`);
    }
  } else if (line === "/features") {
    const features = listFeatures();
    if (features.length === 0)
      console.log("Sin features todavía: crea features.json con la lista.");
    for (const f of features) console.log(`- [${f.state}] ${f.id} · ${f.description}`);
  } else if (line === "/next") {
    // feature driven: starts if there's no other active
    const feature = nextFeature();
    if (!feature) {
      console.log("Nada que empezar: termina la feature activa (o no quedan pendientes).");
      continue;
    }
    console.log(`Trabajando ${feature.id}: ${feature.description}`);
    console.log(await runAgent(feature.description));
    // pass-state gating: solo pasa a "passing" si su comando de verificación sale en verde.
    console.log(verifyFeature(feature.id) ? `✔ ${feature.id} pasa` : `✘ ${feature.id} aún no pasa`);
  } else if (line === "/check") {
    // Escalera: unidad → integración → E2E, corta en la primera roja.
    console.log(verifyAll() ? "✔ todas las capas en verde" : "✘ falló una capa (ver salida)");
  } else {
    const progress = loadProgress();
    const prompt = progress ? `Progreso previo:\n${progress}\n\nNueva tarea: ${line}` : line;
    const reply = await runAgent(prompt);
    console.log(reply);
    const { passed } = verify();
    console.log(passed ? "✔ tests en verde" : "✘ tests en rojo");
    saveProgress(
      `Última tarea: ${line}\nResultado: ${passed ? "tests en verde" : "tests en rojo"}\n${reply}`,
    );
  }
}
rl.close();

// Clean handoff: don't close leaving the repo half-done; report the state.
const { clean, reasons } = endSession();
console.log(
  clean
    ? "\n✔ sesión cerrada en estado limpio"
    : `\n⚠ cierre con pendientes: ${reasons.join(", ")}`,
);
