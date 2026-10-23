import { defineConfig } from 'vitest/config';

// GitHub Pages serves the game from https://atxlya.github.io/escape-the-college/.
const PAGES_BASE = '/escape-the-college/';

export default defineConfig(({ command, isPreview }) => ({
  // The dev server stays at the root; builds (and `vite preview` of them) use the Pages folder.
  base: command === 'build' || isPreview ? PAGES_BASE : '/',
  build: {
    target: 'es2022',
    // Phaser alone is ~1.2 MB minified, so raise the size warning threshold.
    chunkSizeWarningLimit: 1600,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));
