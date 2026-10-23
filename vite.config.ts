import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative paths so the build works from any folder or host.
  base: './',
  build: {
    target: 'es2022',
    // Phaser alone is ~1.2 MB minified, so raise the size warning threshold.
    chunkSizeWarningLimit: 1600,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
