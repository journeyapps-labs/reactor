import * as React from 'react';
import { CommonKeys, KeyboardContext, KeyboardStore } from '../stores/KeyboardStore';
import { ioc } from '../inversify.config';

export interface UseKeyboardContextOptions {
  enabled: boolean;
  handlers: Partial<Record<CommonKeys, (event: KeyboardEvent) => any>>;
}

export const useKeyboardContext = (options: UseKeyboardContextOptions): KeyboardContext | null => {
  const keyboardStore = React.useMemo(() => ioc.get(KeyboardStore), []);
  const [context, setContext] = React.useState<KeyboardContext | null>(() => {
    return options.enabled ? keyboardStore.pushContext() : null;
  });

  React.useEffect(() => {
    if (options.enabled && !context) {
      setContext(keyboardStore.pushContext());
      return;
    }
    if (!options.enabled && context) {
      context.dispose();
      setContext(null);
    }
  }, [options.enabled, context, keyboardStore]);

  React.useEffect(() => {
    if (!context) {
      return;
    }
    const offs = Object.entries(options.handlers)
      .filter((entry) => !!entry[1])
      .map(([key, action]) => {
        return context.handle({
          key: key as CommonKeys,
          action
        });
      });
    return () => {
      offs.forEach((off) => off());
    };
  }, [context, options.handlers]);

  React.useEffect(() => {
    return () => {
      context?.dispose();
    };
  }, [context]);

  return context;
};
