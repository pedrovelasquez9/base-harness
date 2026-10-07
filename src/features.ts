import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

type FeatureState = "not_started" | "active" | "blocked" | "passing";
type Feature = { id: string; description: string; verify: string; state: FeatureState };

const FILE = "features.json";
const load = (): Feature[] => (existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf-8")) : []);
const save = (features: Feature[]) => writeFileSync(FILE, JSON.stringify(features, null, 2));

// The whole feature list (empty if there is no features.json yet).
export function listFeatures(): Feature[] {
  return load();
}

// WIP=1: the next task is the first not_started, and only if nothing is active.
export function nextFeature(): Feature | undefined {
  const features = load();
  if (features.some((feature) => feature.state === "active")) return undefined;
  return features.find((feature) => feature.state === "not_started");
}

// pass-state gating: a feature reaches "passing" ONLY if its command exits green.
export function verifyFeature(id: string): boolean {
  const features = load();
  const feature = features.find((candidate) => candidate.id === id);
  if (!feature) throw new Error(`Unknown feature: ${id}`);
  const passed = spawnSync(feature.verify, { shell: true, timeout: 60_000 }).status === 0;
  feature.state = passed ? "passing" : "active";
  save(features);
  return passed;
}
