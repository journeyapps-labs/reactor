import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ioc } from '../inversify.config';
import {
  AnchoredOverlayBounds,
  AnchoredOverlayOptions,
  AnchoredOverlayStore
} from '../stores/overlay/AnchoredOverlayStore';

export interface UseAnchoredOverlayOptions extends Omit<AnchoredOverlayOptions, 'bounds' | 'render'> {
  render: AnchoredOverlayOptions['render'];
  forwardRef?: React.RefObject<HTMLElement>;
  enabled?: boolean;
}

export const getAnchoredOverlayBounds = (element: HTMLElement): AnchoredOverlayBounds => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    right: rect.right,
    bottom: rect.bottom
  };
};

export const useAnchoredOverlay = (options: UseAnchoredOverlayOptions) => {
  const localRef = useRef<HTMLElement>(null);
  const forwardRef = options.forwardRef || localRef;
  const overlayStore = ioc.get(AnchoredOverlayStore);
  const idRef = useRef<string>(undefined);

  const update = React.useCallback(() => {
    if (idRef.current && forwardRef.current) {
      overlayStore.update(idRef.current, { bounds: getAnchoredOverlayBounds(forwardRef.current) });
    }
  }, [forwardRef, overlayStore]);

  useEffect(() => {
    if (options.enabled === false || !forwardRef.current) {
      return;
    }

    idRef.current = overlayStore.show({
      source: options.source,
      bounds: getAnchoredOverlayBounds(forwardRef.current),
      placement: options.placement,
      clickThrough: options.clickThrough,
      render: options.render
    });

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(forwardRef.current);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      if (idRef.current) {
        overlayStore.hide(idRef.current);
        idRef.current = undefined;
      }
    };
  }, [
    forwardRef,
    options.enabled,
    options.source,
    options.placement,
    options.clickThrough,
    options.render,
    overlayStore,
    update
  ]);

  return {
    ref: forwardRef,
    update
  };
};
