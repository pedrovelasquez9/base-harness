import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { verifyFeature } from "../src/features.js";

test("solo el comando de verificación promueve a passing", () => {
  writeFileSync(
    "features.json",
    JSON.stringify([
      { id: "F01", description: "suma", verify: 'node -e "process.exit(0)"', state: "not_started" },
    ]),
  );
  assert.equal(verifyFeature("F01"), true); // exit 0 → passing, in an auditable way
});
