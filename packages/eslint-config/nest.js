import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";
import { config as baseConfig } from "./base.js";

/**
 * Shared ESLint config for NestJS services.
 *
 * @param {{ tsconfigRootDir?: string, ignores?: string[] }} [options]
 * @returns {import("eslint").Linter.Config[]}
 */
export const nestJsConfig = (options = {}) => {
  const sharedBaseConfig = Array.isArray(baseConfig) ? baseConfig : [baseConfig];

  return tseslint.config(
    ...sharedBaseConfig,
    {
      ignores: ["eslint.config.mjs", ...(options.ignores ?? [])],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        sourceType: "commonjs",
        parserOptions: {
          projectService: true,
          ...(options.tsconfigRootDir
            ? { tsconfigRootDir: options.tsconfigRootDir }
            : {}),
        },
      },
    },
    {
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
        "prettier/prettier": ["error", { endOfLine: "auto" }],
      },
    },
  );
};
