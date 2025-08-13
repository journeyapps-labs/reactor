import { useCallback, useEffect, useState } from 'react';
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
}

export const useDimensionObserver = (props: UseDimensionObserverOptions) => {
  const [dimensions, setDimensions] = useState<Dimensions>(null);

  let check = useCallback(() => {
    if (!props.element.current) {
      return;
    }
    let dims = _.pick(props.element.current.getBoundingClientRect(), ['x', 'y', 'width', 'height']);
    if (!_.isEqual(dims, dimensions)) {
      setDimensions(dims);
    }
  }, [dimensions]);

  useEffect(() => {
    if (dimensions) {
      props.changed(dimensions);
    }
  }, [dimensions]);

  useEffect(() => {
    check();
    let interval = setInterval(() => {
      check();
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [props.element, dimensions]);
};
