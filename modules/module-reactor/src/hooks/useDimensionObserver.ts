import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import * as _ from 'lodash';

export interface Dimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UseDimensionObserverOptions {
  changed: (dimensions: Dimensions) => any;
  element: React.RefObject<HTMLElement>;
  enabled?: boolean;
}

export const useDimensionObserver = (props: UseDimensionObserverOptions, bust: any[] = []) => {
  const [dimensions, setDimensions] = useState<Dimensions>(null);

  let check = useCallback(() => {
    if (props.enabled === false || !props.element.current) {
      return;
    }
    let dims = _.pick(props.element.current.getBoundingClientRect(), ['x', 'y', 'width', 'height']);
    if (!_.isEqual(dims, dimensions)) {
      setDimensions(dims);
    }
  }, [dimensions, props.element, props.enabled]);

  useEffect(() => {
    if (dimensions && props.enabled !== false) {
      props.changed(dimensions);
    }
  }, [dimensions, props.enabled, ...bust]);

  useLayoutEffect(() => {
    if (props.enabled === false) {
      return;
    }

    check();
    let interval = setInterval(() => {
      check();
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [props.element, props.enabled, dimensions]);
};
