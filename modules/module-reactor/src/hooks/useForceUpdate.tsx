import { useEffect, useState } from 'react';
import * as _ from 'lodash';

export function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state

  const [setValueDebounced] = useState(() => {
    return _.debounce(
      (value) => {
        setValue(value);
      },
      50,
      { leading: false, trailing: true }
    );
  });

  useEffect(() => {
    return () => {
      setValueDebounced.cancel();
    };
  }, []);

  return (props: { defer?: boolean } = {}) => {
    // in some cases we may wish to defer rendering if mobx is (for example) mostly controlling a component.
    // this essentially prevents a re-render during a re-render (which would throw a warning)
    if (props.defer) {
      setValueDebounced((value) => value + 1);
      return;
    }
    setValue((value) => value + 1);
  };
}
