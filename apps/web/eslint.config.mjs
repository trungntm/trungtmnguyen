import { createNextAppEslintConfig } from '../../packages/config/eslint/next-app.mjs';

export default createNextAppEslintConfig({
  rootDir: import.meta.dirname,
});
