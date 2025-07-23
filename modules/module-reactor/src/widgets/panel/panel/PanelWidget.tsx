import * as React from 'react';
import { ioc } from '../../../inversify.config';
import { WorkspaceStore } from '../../../stores/workspace/WorkspaceStore';
import { AttentionWrapperWidget } from '../../guide/AttentionWrapperWidget';
import { getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';
import { ReactorComponentType } from '../../../stores/guide/selections/common';
import { ReactorPanelModel } from '../../../stores/workspace/react-workspaces/ReactorPanelModel';
import { css } from '@emotion/react';
import { themed, theme } from '../../../stores/themes/reactor-theme-fragment';
import { AwSnapWidget } from './AwSnapWidget';
import { ReactorPanelFactory } from '../../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { Observer } from 'mobx-react';
import { GetTheme, ThemeColors } from '../../../stores/themes/ThemeFragment';

export const WorkspaceModelContext = React.createContext<ReactorPanelModel>(null);

export interface PanelWidgetProps {
  event: WorkspaceModelFactoryEvent<ReactorPanelModel>;
  factory: ReactorPanelFactory;
  padding?: boolean;
  urlEnabled?: boolean;
}

export interface PanelWidgetState {
  error: boolean;
}

export class PanelWidget extends React.Component<React.PropsWithChildren<PanelWidgetProps>, PanelWidgetState> {
  ref: React.RefObject<HTMLDivElement>;
  listener: (event: MouseEvent) => any;

  constructor(props: PanelWidgetProps) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      error: false
    };
  }

  componentDidMount(): void {
    if (this.props.urlEnabled) {
      this.listener = () => {
        const store = ioc.get(WorkspaceStore);
        store.activatePanel(this.props.event.model);
      };

      this.ref.current?.addEventListener('mousedown', this.listener, {
        capture: true
      });
    }
  }

  componentWillUnmount(): void {
    const store = ioc.get(WorkspaceStore);
    if (store.activatedModel === this.props.event.model) {
      store.activatePanel(null);
    }
    if (this.listener) {
      this.ref.current?.removeEventListener('mousedown', this.listener, {
        capture: true
      });
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error: true
    });
  }

  getContent(selected: boolean) {
    return (
      <S.Container ref={this.ref} attention={selected}>
        <Observer render={() => this.props.factory.generateToolbar(this.props.event)} />
        {this.props.padding ? (
          <S.PanelScrolled ref={this.ref}>{this.props.children}</S.PanelScrolled>
        ) : (
          <S.PanelNormal ref={this.ref}>{this.props.children}</S.PanelNormal>
        )}
      </S.Container>
    );
  }

  render() {
    if (this.state.error) {
      return <AwSnapWidget />;
    }
    return (
      <WorkspaceModelContext.Provider value={this.props.event.model}>
        <AttentionWrapperWidget
          type={ReactorComponentType.PANEL}
          forwardRef={this.ref}
          activated={(selected) => {
            if (this.props.event.model.grabAttention !== !!selected) {
              this.props.event.model.grabAttention = !!selected;
            }
            return this.getContent(!!selected);
          }}
        />
      </WorkspaceModelContext.Provider>
    );
  }
}

export const PANEL_CONTENT_PADDING = 6;

export const _getScrollableCSS = (color: string) => {
  return css`
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-thumb {
      background: ${color};
      border-radius: 10px;
    }

    ::-webkit-scrollbar-corner {
      background: transparent;
    }
  `;
};

export const ScrollableDivCss = _getScrollableCSS('rgba(255, 255, 255, 0.2)');

export const getScrollableCSS = (t: GetTheme<typeof theme>) => {
  return _getScrollableCSS(t.panels.scrollBar);
};

namespace S {
  export const Container = themed.div<{ attention: boolean }>`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    ${(p) => (p.attention ? `border: solid 1px ${p.theme.guide.accent}` : ``)};
    ${(p) => (p.attention ? `box-shadow: 0 0 20px 0px inset ${getTransparentColor(p.theme.guide.accent, 0.2)}` : ``)};
  `;

  export const PanelNormal = themed.div`
    background: ${(p) => p.theme.panels.background};
    position: relative;
    flex-grow: 1;
    overflow: hidden;
    box-sizing: border-box;
  `;

  export const PanelScrolled = themed.div`
    background: ${(p) => p.theme.panels.background};
    position: relative;
    flex-grow: 1;
    overflow-y: auto;
    padding: ${PANEL_CONTENT_PADDING}px;
    box-sizing: border-box;
    ${(p) => getScrollableCSS(p.theme)};
  `;
}
