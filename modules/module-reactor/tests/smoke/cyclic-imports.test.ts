import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Cyclic import smoke tests', () => {
  beforeEach(() => {
    (globalThis as any).window = (globalThis as any).window || ({} as Window & typeof globalThis);
    (window as any).process = (window as any).process || { env: {} };
    (window as any).reactorModuleLoaded = vi.fn();
    (globalThis as any).process = (globalThis as any).process || { env: {} };
  });

  it('loads the dist-module bundle without TDZ runtime errors', async () => {
    await expect(import('../../dist-module/bundle.js')).resolves.toBeDefined();
  }, 15000);
});
