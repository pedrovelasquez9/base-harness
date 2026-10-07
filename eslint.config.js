import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/**", "workspace/**"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  // The adapter needs `any` at the SDK boundary; ban it everywhere else.
  { files: ["src/llm/**"], rules: { "@typescript-eslint/no-explicit-any": "off" } },
);
