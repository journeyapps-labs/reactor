/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { join } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: [join(__dirname, './tests/setup.ts')]
  }
});
