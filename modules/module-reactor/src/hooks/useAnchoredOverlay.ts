import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ioc } from '../inversify.config';
import {
  AnchoredOverlayBounds,
  AnchoredOverlayOptions,
  AnchoredOverlayRecord,
  AnchoredOverlayStore
} from '../stores/overlay/AnchoredOverlayStore';
import { useDimensionObserver } from './useDimensionObserver';

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
  const overlayRef = useRef<AnchoredOverlayRecord>(undefined);

  const update = React.useCallback(() => {
    if (overlayRef.current && forwardRef.current) {
      overlayRef.current.update({ bounds: getAnchoredOverlayBounds(forwardRef.current) });
    }
  }, [forwardRef]);

  useDimensionObserver(
    {
      element: forwardRef,
      changed: update,
      enabled: options.enabled !== false
    },
    [options.enabled]
  );

  useEffect(() => {
    if (options.enabled === false || !forwardRef.current) {
      return;
    }

    overlayRef.current = overlayStore.show(
      new AnchoredOverlayRecord({
        id: options.id,
        source: options.source,
        bounds: getAnchoredOverlayBounds(forwardRef.current),
        placement: options.placement,
        clickThrough: options.clickThrough,
        render: options.render
      })
    );

    return () => {
      if (overlayRef.current) {
        overlayRef.current.hide();
        overlayRef.current = undefined;
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
