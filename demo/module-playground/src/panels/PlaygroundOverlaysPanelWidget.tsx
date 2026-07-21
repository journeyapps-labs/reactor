import * as React from 'react';
import { observer } from 'mobx-react';
import {
  AnchoredOverlayPlacement,
  AnchoredOverlayStore,
  CardWidget,
  getAnchoredOverlayBounds,
  ioc,
  ReactorPanelModel,
  styled
} from '@journeyapps-labs/reactor-mod';

export interface PlaygroundOverlaysPanelWidgetProps {
  model: ReactorPanelModel;
}

export const PlaygroundOverlaysPanelWidget: React.FC<PlaygroundOverlaysPanelWidgetProps> = observer(() => {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [overlayId, setOverlayId] = React.useState<string>();
  const overlayStore = ioc.get(AnchoredOverlayStore);

  React.useEffect(() => {
    return () => {
      if (overlayId) {
        overlayStore.hide(overlayId);
      }
    };
  }, [overlayId, overlayStore]);

  React.useEffect(() => {
    if (!overlayId) {
      return;
    }
    const updateBounds = () => {
      if (anchorRef.current) {
        overlayStore.update(overlayId, { bounds: getAnchoredOverlayBounds(anchorRef.current) });
      }
    };
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, true);
    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds, true);
    };
  }, [overlayId, overlayStore]);

  const toggleOverlay = () => {
    if (overlayId) {
      overlayStore.hide(overlayId);
      setOverlayId(undefined);
      return;
    }
    if (!anchorRef.current) {
      return;
    }
    const id = overlayStore.show({
      source: 'playground.overlay-store',
      bounds: getAnchoredOverlayBounds(anchorRef.current),
      placement: AnchoredOverlayPlacement.AUTO,
      clickThrough: false,
      render: ({ above }) => (
        <S.Overlay>
          <S.OverlayTitle>Anchored overlay</S.OverlayTitle>
          <S.OverlayText>Rendered by AnchoredOverlayStore {above ? 'above' : 'below'} the target.</S.OverlayText>
        </S.Overlay>
      )
    });
    setOverlayId(id);
  };

  return (
    <S.Container>
      <CardWidget
        title="Anchored Overlay Store"
        subHeading="Directly register, position, and remove an overlay through the shared store"
        sections={[
          {
            key: 'overlay-store-demo',
            content: () => (
              <S.Demo>
                <S.Anchor ref={anchorRef} onClick={toggleOverlay}>
                  {overlayId ? 'Hide overlay' : 'Show overlay'}
                </S.Anchor>
                <S.Help>Click the button, then resize or scroll the workspace to inspect the anchored layer.</S.Help>
              </S.Demo>
            )
          }
        ]}
      />
    </S.Container>
  );
});

namespace S {
  export const Container = styled.div`
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;

  export const Demo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;

  export const Anchor = styled.button`
    align-self: flex-start;
    border: solid 1px ${(p) => p.theme.guide.accent};
    border-radius: 5px;
    padding: 8px 14px;
    background: transparent;
    color: ${(p) => p.theme.text.primary};
    cursor: pointer;
  `;

  export const Help = styled.div`
    color: ${(p) => p.theme.text.secondary};
    font-size: 13px;
  `;

  export const Overlay = styled.div`
    min-width: 220px;
    padding: 10px;
  `;

  export const OverlayTitle = styled.div`
    color: ${(p) => p.theme.text.primary};
    font-weight: 700;
  `;

  export const OverlayText = styled.div`
    margin-top: 4px;
    color: ${(p) => p.theme.text.secondary};
    font-size: 12px;
  `;
}
