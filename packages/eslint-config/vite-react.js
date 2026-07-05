import reactRefresh from "eslint-plugin-react-refresh"

import { config as reactConfig } from "./react-internal.js"

/**
 * Shared ESLint configuration for browser React applications built with Vite.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const viteReactConfig = [
  ...reactConfig,
  reactRefresh.configs.vite,
]
