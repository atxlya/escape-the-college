import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    // src/logic must stay pure TypeScript so it can be unit-tested without Phaser.
    files: ['src/logic/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'phaser', message: 'src/logic must not import Phaser.' }],
          patterns: [
            {
              group: ['**/scenes/**', '**/entities/**', '**/systems/**'],
              message: 'src/logic must not depend on Phaser-side code.',
            },
          ],
        },
      ],
    },
  },
  prettier,
);
