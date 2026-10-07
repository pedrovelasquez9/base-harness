import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, editFile } from "../src/harness/index.js";

test("editar exige que el fragmento sea único", () => {
  writeFile("greeting.txt", "hola\nhola\nadios");
  assert.equal(readFile("greeting.txt").split("hola").length - 1, 2);

  assert.throws(() => editFile("greeting.txt", "hola", "HOLA")); // ambiguous (x2)
  editFile("greeting.txt", "adios", "chau"); // unique → ok
  assert.ok(readFile("greeting.txt").includes("chau"));
});
