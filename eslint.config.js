import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "dev-dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Flag every <a target="_blank"> so the author has to consciously pair
      // it with rel="noopener noreferrer" (or disable the rule with a
      // comment after verifying it). Prevents reverse tabnabbing.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXAttribute[name.name='target'][value.value='_blank']",
          message:
            'target="_blank" must be paired with rel="noopener noreferrer" — disable this rule inline only after adding rel.',
        },
      ],
    },
  },
]);
