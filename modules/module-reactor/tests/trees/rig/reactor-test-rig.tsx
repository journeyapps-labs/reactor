import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

// React 19 expects this to be truthy in test environments that use act().
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const THEME = {
  trees: {
    labelColor: '#d3deef',
    selectedBackground: '#1c2b44'
  },
  dnd: {
    hintColor: '#1cb7ff',
    hoverColor: '#2a3a5a'
  },
  guide: {
    accent: '#26c7ff'
  },
  panels: {
    background: '#10192b',
    scrollBar: '#5b6a82'
  },
  text: {
    primary: '#d8e2f3',
    secondary: '#93a3bc'
  }
} as any;

export interface ReactorTestRig {
  container: HTMLDivElement;
  unmount: () => Promise<void>;
  flush: (ms?: number) => Promise<void>;
}

export const renderWithReactorTestRig = async (jsx: React.JSX.Element): Promise<ReactorTestRig> => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  await act(async () => {
    root.render(<ThemeProvider theme={THEME}>{jsx}</ThemeProvider>);
  });

  return {
    container,
    flush: async (ms: number = 5) => {
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      });
    },
    unmount: async () => {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    }
  };
};
