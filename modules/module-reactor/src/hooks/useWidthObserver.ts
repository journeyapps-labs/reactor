import * as React from 'react';
import { useLayoutEffect, useState } from 'react';

export const useWidthObserver = (forwardRef?: React.RefObject<HTMLElement>): number => {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = forwardRef?.current;
    if (!element) {
      return;
    }

    const update = () => setWidth(element.clientWidth);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [forwardRef]);

  return width;
};
