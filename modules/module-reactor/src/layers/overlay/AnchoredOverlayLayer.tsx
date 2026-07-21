import * as React from 'react';
import { observer } from 'mobx-react';
import { Observer } from 'mobx-react';
import { inject } from '../../inversify.config';
import { LayerDirective } from '../../stores/layer/LayerDirective';
import {
  AnchoredOverlayPlacement,
  AnchoredOverlayRecord,
  AnchoredOverlayStore
} from '../../stores/overlay/AnchoredOverlayStore';
import { SmartPositionWidget } from '../combo/SmartPositionWidget';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { useLayoutEffect, useRef, useState } from 'react';

namespace S {
  export const Container = styled.div<{ clickThrough: boolean }>`
    position: relative;
    pointer-events: ${(p) => (p.clickThrough ? 'none' : 'auto')};
  `;
}

const getBounds = (bounds: AnchoredOverlayRecord['bounds']) => ({
  top: bounds.top,
  left: bounds.left,
  right: bounds.right ?? bounds.left + bounds.width,
  bottom: bounds.bottom ?? bounds.top + bounds.height
});

const AnchoredOverlayWidget: React.FC<{ overlay: AnchoredOverlayRecord }> = observer(({ overlay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const bounds = getBounds(overlay.bounds);
  const viewportHeight = typeof document === 'undefined' ? 0 : document.body.clientHeight;
  const placement =
    overlay.placement === AnchoredOverlayPlacement.AUTO
      ? bounds.bottom + dimensions.height + 8 <= viewportHeight
        ? AnchoredOverlayPlacement.BOTTOM
        : AnchoredOverlayPlacement.TOP
      : overlay.placement;

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    const update = () => {
      const next = ref.current.getBoundingClientRect();
      setDimensions({ width: next.width, height: next.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [overlay.id, placement]);

  const position = (() => {
    if (placement === AnchoredOverlayPlacement.TOP) {
      return { clientX: bounds.left + overlay.bounds.width / 2, clientY: bounds.top - 8 };
    }
    if (placement === AnchoredOverlayPlacement.RIGHT) {
      return { clientX: bounds.right + 8, clientY: bounds.top + overlay.bounds.height / 2 };
    }
    if (placement === AnchoredOverlayPlacement.LEFT) {
      return { clientX: bounds.left - 8, clientY: bounds.top + overlay.bounds.height / 2 };
    }
    return { clientX: bounds.left + overlay.bounds.width / 2, clientY: bounds.bottom + 8 };
  })();

  return (
    <SmartPositionWidget position={position}>
      <S.Container ref={ref} clickThrough={overlay.clickThrough}>
        {overlay.render({ placement, above: placement === AnchoredOverlayPlacement.TOP })}
      </S.Container>
    </SmartPositionWidget>
  );
});

export class AnchoredOverlayLayer extends LayerDirective {
  @inject(AnchoredOverlayStore)
  accessor overlayStore: AnchoredOverlayStore;

  getLayerContent(): React.JSX.Element {
    return (
      <Observer
        render={() => (
          <>
            {this.overlayStore.getOverlays().map((overlay) => (
              <AnchoredOverlayWidget key={overlay.id} overlay={overlay} />
            ))}
          </>
        )}
      />
    );
  }

  show() {
    return this.overlayStore.hasOverlays();
  }

  transparent() {
    return this.overlayStore.isClickThrough();
  }

  alwaysOnTop() {
    return true;
  }
}
