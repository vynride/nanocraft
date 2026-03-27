import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/*.min.js",
      "**/build/**"
    ],
  },
  {
    plugins: {
      react,
    },
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        process: "readonly"
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
