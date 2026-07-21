import * as React from 'react';
import { observer } from 'mobx-react';
import {
  CardWidget,
  ComponentSelection,
  GuideStore,
  ReactorPanelModel,
  styled,
  ioc
} from '@journeyapps-labs/reactor-mod';

export interface PlaygroundGuidePanelWidgetProps {
  model: ReactorPanelModel;
}

export const PlaygroundGuidePanelWidget: React.FC<PlaygroundGuidePanelWidgetProps> = observer(() => {
  const targetRef = React.useRef<HTMLButtonElement>(null);
  const [active, setActive] = React.useState(false);
  const guideStore = ioc.get(GuideStore);
  const selection = React.useMemo(() => new ComponentSelection({ type: 'playground.guide-target' }), []);

  React.useEffect(() => {
    if (!active || !targetRef.current) {
      return;
    }

    const updateBounds = () => {
      const rect = targetRef.current?.getBoundingClientRect();
      if (rect) {
        selection.setRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
      }
    };

    selection.showTooltip('This tooltip is owned by GuideStore and rendered by the shared overlay layer.');
    guideStore.select(selection);
    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(targetRef.current);
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, true);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds, true);
      selection.dispose();
    };
  }, [active, guideStore, selection]);

  return (
    <S.Container>
      <CardWidget
        title="Guide System"
        subHeading="GuideStore selections use the same anchored overlay infrastructure"
        sections={[
          {
            key: 'guide-system-demo',
            content: () => (
              <S.Demo>
                <S.Target ref={targetRef} onClick={() => setActive((value) => !value)}>
                  {active ? 'Stop guide selection' : 'Start guide selection'}
                </S.Target>
                <S.Help>Activate the selection to see the guide tooltip track this component.</S.Help>
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
  `;

  export const Demo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;

  export const Target = styled.button`
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
}
