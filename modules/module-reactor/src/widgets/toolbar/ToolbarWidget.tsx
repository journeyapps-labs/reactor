import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { ToolbarPosition, ToolbarPreference } from '../../settings/ToolbarPreference';
import { PinnableZoneWidget } from '../header/PinnableZoneWidget';
import { observer } from 'mobx-react';
import { PanelButtonWidget } from '../forms/PanelButtonWidget';
import { ioc } from '../../inversify.config';
import { ComboBoxStore2 } from '../../stores/combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { Fonts } from '../../fonts';

const loader = require('../../../media/loader.png');

export interface ToolbarWidgetProps {
  vertical: boolean;
  preferences: ToolbarPreference;
  position: ToolbarPosition;
  hide: () => any;
}

namespace S {
  const SIZE = 10;

  export const ContainerVertical = themed.div`
    min-width: 40px;
    width: 40px;
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1px;
    background: ${(p) => p.theme.panels.background};
    margin-top: 2px;
    margin-bottom: 2px;
    position: relative;
  `;

  export const Layer = themed.div`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0
  `;

  export const ToolbarEmpty = themed.div`
    background-image: url(${loader});
    background-size: ${SIZE}px ${SIZE}px;
    height: 100%;
    width: 100%;
    opacity: ${(p) => (p.theme.light ? 0.2 : 0.5)};
    top: 0;
    left: 0;
  `;

  export const Text = themed.div`
    transform: rotateZ(-90deg);
    font-family: ${Fonts.PRIMARY};
    font-size: 14px;
    color: ${(p) => p.theme.text.primary};
    position: absolute;
    top: 50%;
    margin-left: -2px;
    opacity: 0.7;
    white-space: nowrap;
  `;

  export const Button = themed(PanelButtonWidget)`
    top: calc(50% - 140px);
    left: 50%;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
  `;
}

export const ToolbarWidget: React.FC<ToolbarWidgetProps> = observer((props) => {
  if (props.preferences.buttons.length === 0) {
    return (
      <S.ContainerVertical>
        <S.ToolbarEmpty></S.ToolbarEmpty>
        <S.Text>Toolbar - Drag items / actions here</S.Text>
        <S.Layer>
          <PinnableZoneWidget size={40} preference={props.preferences} vertical={true} />
        </S.Layer>
        <S.Button
          icon="times"
          action={() => {
            props.hide();
          }}
        />
      </S.ContainerVertical>
    );
  }

  return (
    <S.ContainerVertical
      onContextMenu={(event) => {
        event.preventDefault();
        ioc.get(ComboBoxStore2).show(
          new SimpleComboBoxDirective({
            event,
            items: [
              {
                title: 'Hide toolbar',
                key: 'hide',
                action: async () => {
                  props.hide();
                }
              },
              {
                title: 'Clear items',
                key: 'clear',
                action: async () => {
                  props.preferences.reset();
                  props.preferences.save();
                }
              }
            ]
          })
        );
      }}
    >
      <S.ToolbarEmpty />
      <S.Layer>
        <PinnableZoneWidget size={40} preference={props.preferences} vertical={true} />
      </S.Layer>
    </S.ContainerVertical>
  );
});
