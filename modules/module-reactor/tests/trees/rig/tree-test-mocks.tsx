import React from 'react';
import { vi } from 'vitest';

vi.mock('../../../src/inversify.config', () => {
  const serviceProxy = new Proxy(
    {},
    {
      get: () => {
        return () => {};
      }
    }
  );

  return {
    inject: () => {
      return () => {};
    },
    ioc: {
      get: () => {
        return serviceProxy;
      }
    }
  };
});

vi.mock('../../../src/widgets/guide/AttentionWrapperWidget', () => {
  return {
    useAttention: () => null,
    AttentionWrapperWidget: (props: { activated: (selected: null) => React.JSX.Element }) => {
      return props.activated(null);
    }
  };
});
