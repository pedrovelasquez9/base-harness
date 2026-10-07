import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { resolveInsideWorkspace } from "../workspace.js";
import { registerTool } from "../registry.js";

// File TOOLS: eyes (read) and pencil (write/edit), confined to WORKDIR.
export function readFile(relativePath: string): string {
  return readFileSync(resolveInsideWorkspace(relativePath), "utf-8");
}

export function writeFile(relativePath: string, content: string): string {
  const target = resolveInsideWorkspace(relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf-8");
  return `wrote ${relativePath} (${content.length} chars)`;
}

export function editFile(relativePath: string, search: string, replacement: string): string {
  const target = resolveInsideWorkspace(relativePath);
  const original = readFileSync(target, "utf-8");
  const occurrences = original.split(search).length - 1;
  if (occurrences !== 1)
    throw new Error(`'search' debe aparecer exactamente 1 vez, aparece ${occurrences}.`);
  writeFileSync(target, original.replace(search, replacement), "utf-8");
  return "edited ok";
}

registerTool(
  {
    name: "read_file",
    description: "Lee un archivo del espacio de trabajo.",
    inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },
  },
  ({ path }) => readFile(path as string),
);

registerTool(
  {
    name: "write_file",
    description: "Escribe (crea o reemplaza) un archivo.",
    inputSchema: {
      type: "object",
      properties: { path: { type: "string" }, content: { type: "string" } },
      required: ["path", "content"],
    },
  },
  ({ path, content }) => writeFile(path as string, content as string),
);

registerTool(
  {
    name: "edit_file",
    description: "Reemplaza un fragmento único por otro.",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
        search: { type: "string" },
        replacement: { type: "string" },
      },
      required: ["path", "search", "replacement"],
    },
  },
  ({ path, search, replacement }) =>
    editFile(path as string, search as string, replacement as string),
);
