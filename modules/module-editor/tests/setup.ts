import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

if (!(document as any).queryCommandSupported) {
  (document as any).queryCommandSupported = vi.fn(() => false);
}

if (!(document as any).queryCommandEnabled) {
  (document as any).queryCommandEnabled = vi.fn(() => false);
}

if (!(document as any).execCommand) {
  (document as any).execCommand = vi.fn(() => false);
}
