import { resolve, sep } from "node:path";
import { mkdirSync } from "node:fs";

// The agent lives only in here. Created when the module loads.
export const WORKDIR = resolve("./workspace");
mkdirSync(WORKDIR, { recursive: true });

// Path GUARD: resolves inside WORKDIR and rejects anything that escapes it (../../etc).
export function resolveInsideWorkspace(relativePath: string): string {
  const target = resolve(WORKDIR, relativePath);
  // The `+ sep` stops "/work" from wrongly accepting "/work-other".
  if (target !== WORKDIR && !target.startsWith(WORKDIR + sep))
    throw new Error(`Ruta fuera del espacio de trabajo: ${relativePath}`);
  return target;
}
