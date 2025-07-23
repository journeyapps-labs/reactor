import * as React from 'react';
import { MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Btn } from '../../../../definitions/common';
import { PanelTitleToolbarButtonWidget } from './PanelTitleToolbarButtonWidget';
import { isArray } from 'lodash';
import { styled } from '../../../../stores/themes/reactor-theme-fragment';

export interface PanelToolbarButton extends Btn {
  enabled?: boolean;
  showLabel?: boolean;
}

export interface PanelTitleToolbarContext {
  name: string;
  tracking: boolean;
  onChange: (event: MouseEvent) => any;
}

export interface PanelTitleToolbarWidgetProps {
  context?: PanelTitleToolbarContext | PanelTitleToolbarContext[];
  btns?: PanelToolbarButton[];
}

namespace S {
  const HEIGHT = 28;

  export const Container = styled.div`
    min-height: ${HEIGHT}px;
    flex-shrink: 0;
    background: ${(p) => p.theme.panels.iconBackground};
    display: flex;
    align-items: center;
    cursor: pointer;
    flex-wrap: wrap;
    column-gap: 2px;
    row-gap: 2px;
    padding: 2px;
  `;

  export const Context = styled.div<{ tracking: boolean }>`
    display: flex;
    padding-left: 5px;
    padding-right: 5px;
    align-items: center;
    color: ${(p) => (p.tracking ? p.theme.tabs.selectedAccentSingle : p.theme.panels.tabForeground)};
  `;

  export const ContextLabel = styled.div`
    font-size: 12px;
    white-space: nowrap;
  `;

  export const Icon = styled(FontAwesomeIcon)`
    margin-left: 5px;
    font-size: 12px;
  `;

  export const Buttons = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
  `;
}

export class PanelTitleToolbarWidget extends React.Component<PanelTitleToolbarWidgetProps> {
  createContextWidget(opts: PanelTitleToolbarContext) {
    return (
      <S.Context
        key={opts.name}
        tracking={opts.tracking}
        onClick={(event) => {
          event.persist();
          opts.onChange(event);
        }}
      >
        <S.ContextLabel>{opts.name}</S.ContextLabel>
        <S.Icon icon="angle-down" />
      </S.Context>
    );
  }

  getContextButton() {
    if (!this.props.context) {
      return null;
    }

    if (isArray(this.props.context)) {
      if (this.props.context.length == 0) {
        return null;
      }

      return <>{this.props.context.map((curContext) => this.createContextWidget(curContext))}</>;
    }

    return this.createContextWidget(this.props.context);
  }

  render() {
    return (
      <S.Container>
        {this.getContextButton()}
        {this.props.btns ? (
          <S.Buttons>
            {this.props.btns.map((p) => {
              return <PanelTitleToolbarButtonWidget {...p} key={p.tooltip} />;
            })}
          </S.Buttons>
        ) : null}
      </S.Container>
    );
  }
}
