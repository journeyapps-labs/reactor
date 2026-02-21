/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { join } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'reactor-vitest-class-field-fix',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('/src/widgets/tree/TreeLeafWidget.tsx')) {
          return code.replace(/^\s*ref:\s*React\.RefObject<HTMLDivElement>;\s*$/m, '');
        }
        if (id.endsWith('/src/widgets/tree/TreeWidget.tsx')) {
          return code.replace(/^\s*timer:\s*any;\s*$/m, '');
        }
        return null;
      }
    }
  ],
  test: {
    environment: 'jsdom',
    setupFiles: [join(__dirname, './tests/setup.ts')]
  }
});
