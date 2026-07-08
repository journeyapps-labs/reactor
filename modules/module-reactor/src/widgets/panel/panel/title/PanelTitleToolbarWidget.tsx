import * as React from 'react';
import { MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Btn } from '../../../../definitions/common';
import { PanelTitleToolbarButtonWidget } from './PanelTitleToolbarButtonWidget';
import { isArray } from 'lodash';
import { styled } from '../../../../stores/themes/reactor-theme-fragment';
import { REACTOR_MOBILE_MEDIA_QUERY } from '../../../../hooks/useReactorViewportMode';

export interface PanelToolbarButton extends Btn {
  enabled?: boolean;
  showLabel?: boolean;
}

export interface PanelTitleToolbarContext {
  label: string;
  value?: string;
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

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      min-height: 40px;
      padding: 4px;
      column-gap: 8px;
    }
  `;

  export const Context = styled.div<{ tracking: boolean }>`
    display: flex;
    padding-left: 5px;
    padding-right: 5px;
    align-items: center;
    min-width: 0;
    max-width: 100%;
    color: ${(p) => (p.tracking ? p.theme.tabs.selectedAccentSingle : p.theme.panels.tabForeground)};

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      min-height: 32px;
      padding-left: 8px;
      padding-right: 8px;
    }
  `;

  export const ContextLabelValue = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    min-width: 0;
    gap: 3px;
  `;

  export const ContextLabel = styled.div`
    font-size: 12px;
    opacity: 0.58;
    flex-shrink: 0;
    white-space: nowrap;

    &::after {
      content: ':';
    }

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      font-size: 15px;
    }
  `;

  export const ContextValue = styled.div`
    font-size: 12px;
    min-width: 0;
    overflow-wrap: anywhere;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      font-size: 15px;
    }
  `;

  export const Icon = styled(FontAwesomeIcon)`
    margin-left: 5px;
    flex-shrink: 0;
    font-size: 12px;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      margin-left: 8px;
      font-size: 15px;
    }
  `;

  export const ContextText = styled.div`
    display: flex;
    min-width: 0;
    max-width: 100%;
  `;

  export const Buttons = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      column-gap: 4px;
    }
  `;
}

export class PanelTitleToolbarWidget extends React.Component<PanelTitleToolbarWidgetProps> {
  createContextWidget(opts: PanelTitleToolbarContext) {
    return (
      <S.Context
        key={`${opts.label}:${opts.value || ''}`}
        tracking={opts.tracking}
        onClick={(event) => {
          event.persist();
          opts.onChange(event);
        }}
      >
        <S.ContextText>
          {opts.value ? (
            <S.ContextLabelValue>
              <S.ContextLabel>{opts.label}</S.ContextLabel>
              <S.ContextValue>{opts.value}</S.ContextValue>
            </S.ContextLabelValue>
          ) : (
            <S.ContextValue>{opts.label}</S.ContextValue>
          )}
        </S.ContextText>
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
            {this.props.btns.map((p, index) => {
              return <PanelTitleToolbarButtonWidget {...p} key={p.label || p.tooltip || index} />;
            })}
          </S.Buttons>
        ) : null}
      </S.Container>
    );
  }
}
