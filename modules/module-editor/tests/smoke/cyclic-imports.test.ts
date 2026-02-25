import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Cyclic import smoke tests', () => {
  beforeEach(() => {
    (globalThis as any).window = (globalThis as any).window || ({} as Window & typeof globalThis);
    (window as any).process = (window as any).process || { env: {} };
    (window as any).reactorModuleLoaded = vi.fn();
    (globalThis as any).process = (globalThis as any).process || { env: {} };
  });

  const loadUMDBundle = (bundlePath: string) => {
    const source = readFileSync(bundlePath, 'utf8');
    const execute = new Function(source);
    execute();
  };

  it('loads reactor + editor bundles and reports globals', async () => {
    // Load core first so UMD globals are initialized exactly as browser startup does.
    loadUMDBundle(resolve(process.cwd(), '../module-reactor/dist-module/bundle.js'));
    loadUMDBundle(resolve(process.cwd(), './dist-module/bundle.js'));

    expect((window as any).reactorModuleLoaded).toHaveBeenCalledWith('module-reactor');
    expect((window as any).reactorModuleLoaded).toHaveBeenCalledWith('module-editor');
    expect((window as any).MonacoEnvironment).toBeDefined();
  }, 15000);
});
