import { test } from "node:test";
import assert from "node:assert/strict";
import { saveProgress, loadProgress } from "../src/session.js";

test("el progreso sobrevive entre sesiones", () => {
  saveProgress("- [x] F01 login\n- [ ] F02 signup");
  assert.match(loadProgress(), /F02/); // a fresh session recovers the state
});
