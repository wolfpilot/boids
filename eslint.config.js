import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"
import prettierRecommended from "eslint-plugin-prettier/recommended"

export default defineConfig({
  ignores: [
    ".cache/**",
    ".parcel-cache/**",
    "coverage/**",
    "dist/**",
    ".husky/**",
  ],
  files: ["src/**/*.ts"],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    prettierRecommended,
  ],
  languageOptions: {
    globals: {
      describe: "readonly",
      expect: "readonly",
      it: "readonly",
      jest: "readonly",
    },
  },
  rules: {
    "no-console": ["warn", { allow: ["info", "warn", "error"] }],
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      { allowTernary: true, allowShortCircuit: true },
    ],
  },
})
