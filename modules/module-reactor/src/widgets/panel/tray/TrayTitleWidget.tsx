import * as React from 'react';
import { Btn } from '../../../definitions/common';
import { styled, themed } from '../../../stores/themes/reactor-theme-fragment';
import { ComboBoxStore } from '../../../stores/combo/ComboBoxStore';
import { inject } from '../../../inversify.config';
import { IconWidget } from '../../icons/IconWidget';
import { observer } from 'mobx-react';
import { TAB_BAR_HEIGHT } from '../../../stores/workspace/react-workspaces/ReactorTabFactory';

export interface TrayTitleWidgetProps {
  btns?: Btn[];
  collapse: () => any;
}

namespace S {
  export const Button = styled.div`
    align-self: stretch;
    padding-left: 2px;
    padding-right: 2px;
    margin-right: 2px;
    opacity: 0.6;
    cursor: pointer;
    display: flex;
    color: ${(p) => p.theme.text.primary};
    align-items: center;
    font-size: 11px;

    &:hover {
      opacity: 1;
    }
  `;

  export const Buttons = styled.div`
    flex-shrink: 0;
    display: flex;
    margin-right: 5px;
    margin-left: 5px;
  `;

  export const Spacer = styled.div`
    flex-grow: 1;
  `;

  export const Title = themed.div`
    width: 100%;
    display: flex;
    height: ${TAB_BAR_HEIGHT}px;
    flex-shrink: 0;
    background: ${(p) => p.theme.panels.trayBackground};
    box-sizing: border-box;
  `;
}

@observer
export class TrayTitleWidget extends React.Component<TrayTitleWidgetProps> {
  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  btn(p: Btn, index) {
    return (
      <S.Button
        aria-label={p.tooltip}
        data-balloon-pos="left"
        key={p.tooltip || index}
        onClick={(event) => {
          event.persist();
          p.action && p.action(event);
        }}
      >
        <IconWidget icon={p.icon} />
      </S.Button>
    );
  }

  render() {
    return (
      <S.Title
        onDoubleClick={() => {
          this.props.collapse();
        }}
      >
        <S.Spacer />
        <S.Buttons>
          {(this.props.btns || []).map((btn, index) => {
            return this.btn(btn, index);
          })}
        </S.Buttons>
      </S.Title>
    );
  }
}
