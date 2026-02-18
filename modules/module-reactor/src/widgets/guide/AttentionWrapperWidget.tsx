import * as React from 'react';
import { WorkspaceModelContext } from '../panel/panel/WorkspaceModelContext';
import { useContext, useEffect, useState, useRef } from 'react';
import { v4 } from 'uuid';
import { ioc } from '../../inversify.config';
import { GuideStore } from '../../stores/guide/GuideStore';
import { ComponentSelection, MutableRect } from '../../stores/guide/selections/ComponentSelection';
import * as _ from 'lodash';

export interface UseAttentionProps<V extends object = object, T extends ComponentSelection<V> = ComponentSelection<V>> {
  type: string;
  forwardRef?: React.RefObject<HTMLElement>;
  ready?: boolean;
  selection?: V;
  boundsMutator?: (bounds: MutableRect) => MutableRect;
}

interface AttentionState<T extends ComponentSelection> {
  observer: ResizeObserver;
  observer2: PositionObserver;
  listener: () => any;
  selection: T;
  elementChecker?: any;
}

const waitForElement = (ref, cb: (element: HTMLElement) => any, failed: () => any) => {
  let iterations = 0;
  if (ref.current) {
    cb(ref.current);
    return null;
  }
  const checker = setInterval(() => {
    if (ref.current) {
      clearInterval(checker);
      cb(ref.current);
    } else {
      iterations++;
      if (iterations > 10) {
        clearInterval(checker);
        failed();
      }
    }
  }, 100);
  return checker;
};

class PositionObserver {
  x: number;
  y: number;
  updated: () => any;
  interval?: any;
  element: HTMLElement;

  constructor(updated: () => any) {
    this.updated = updated;
  }

  private update(fire: boolean = true) {
    try {
      const pos = this.element.getBoundingClientRect();
      if (pos.x !== this.x || pos.y !== this.y) {
        this.x = pos.x;
        this.y = pos.y;
        if (fire) {
          this.updated();
        }
      }
    } catch (ex) {
      console.error('Failed to get position of tracking element in PositionObserver');
    }
  }

  observe(element: HTMLElement) {
    if (!element) {
      throw 'Position observer must be a valid HTML element';
    }
    this.element = element;
    // setup initial position
    this.update(false);
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.update();
      }, 500);
    }
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const useAttention = <V extends object = object, T extends ComponentSelection<V> = ComponentSelection<V>>(
  props: UseAttentionProps<V, T>
): T | null => {
  const [id, setID] = useState(null);
  const [state, setState] = useState<AttentionState<T>>(null);
  const stateRef = useRef(state);
  const context = useContext(WorkspaceModelContext);

  useEffect(() => {
    if (!id && (props.ready ?? true)) {
      const generatedID = v4();
      ioc.get(GuideStore).registerVisibleComponent({
        id: generatedID,
        type: props.type,
        selection: {
          ...props.selection,
          panel: context?.type || null
        },
        generate: (selection: T) => {
          const updateBounds = () => {
            const size = props.forwardRef.current.getBoundingClientRect();
            const mutableRect: MutableRect = {
              top: size.top,
              left: size.left,
              width: size.width,
              height: size.height
            };
            if (props.boundsMutator) {
              selection.setRect(props.boundsMutator(mutableRect));
            } else {
              selection.setRect(size);
            }
          };

          // we setup a resize observer to listen to the changes to the bounds so we
          // can better render things like tooltips etc..
          // since this is expensive, we only do it when we activate the components
          const observer = new ResizeObserver((event) => {
            if (props.forwardRef.current) {
              updateBounds();
            }
          });

          // we also listen to the position
          const observer2 = new PositionObserver(() => {
            if (props.forwardRef.current) {
              updateBounds();
            }
          });

          // wait for element to be visible
          const listener2 = waitForElement(
            props.forwardRef,
            (ref) => {
              observer.observe(ref);
              observer2.observe(ref);
              updateBounds();
            },
            () => {
              console.log('Failed to get element', props);
            }
          );

          const listener = selection.registerListener({
            deactivated: () => {
              observer.disconnect();
              observer2.disconnect();
              listener?.();
              setState(null);
            }
          });
          setState({
            listener,
            observer,
            observer2,
            selection,
            elementChecker: listener2
          });
        }
      });
      setID(generatedID);
    }

    return () => {
      stateRef?.current?.listener?.();
      stateRef?.current?.observer?.disconnect();
      stateRef?.current?.observer2?.disconnect();
      stateRef?.current?.selection?.setRect(null);

      if (id) {
        ioc.get(GuideStore).unregisterVisibleComponent(id);
      }

      if (stateRef?.current?.elementChecker) {
        clearInterval(stateRef.current.elementChecker);
      }
    };
  }, [id, ..._.values(props.selection), props.ready]);

  return state?.selection;
};

export interface AttentionWrapperWidgetProps<
  V extends object = object,
  T extends ComponentSelection<V> = ComponentSelection<V>
> extends UseAttentionProps<V, T> {
  activated: (selected: T | null) => React.JSX.Element;
}

export const AttentionWrapperWidget: <
  V extends object = object,
  T extends ComponentSelection<V> = ComponentSelection<V>
>(
  props: AttentionWrapperWidgetProps<V, T>
) => React.JSX.Element = <V extends object = object, T extends ComponentSelection<V> = ComponentSelection<V>>(
  props: AttentionWrapperWidgetProps<V, T>
) => {
  const selected = useAttention<V, T>(props);
  return props.activated(selected);
};
