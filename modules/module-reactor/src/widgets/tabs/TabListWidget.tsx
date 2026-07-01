import * as React from 'react';
import * as _ from 'lodash';
import styled from '@emotion/styled';
import { MouseEvent } from 'react';
import { TabBadgeWidget } from './TabBadgeWidget';

export interface TabDirective {
  key: string;
  name: string;
  tabContent?: () => React.JSX.Element;
  disabled?: boolean;
}

export interface TabBadgeDirective {
  content: string;
  color: string;
}

export interface TabSelectionWidgetProps {
  tabs: TabDirective[];
  selected: string;
  tabSelected: (key: string) => any;
  tabRightClick?: (event: MouseEvent, tab: TabDirective) => any;
  selectedBoundsUpdated?: (rect: { left: number; width: number }) => any;
  className?;
  compact?: boolean;
  badgeProvider?: (key: string) => TabBadgeDirective;
}

export interface TabBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface TabListWidgetProps extends TabSelectionWidgetProps {
  tabItemGenerator: (tab: TabDirective, ref: React.RefObject<HTMLDivElement>) => React.JSX.Element;
  selectedBackgroundGenerator?: (bounds?: TabBounds) => React.JSX.Element;
}

export interface TabItemWidgetProps {
  tabSelected: (event: MouseEvent) => any;
  tabRightClick: (event: MouseEvent) => any;
  label: string;
  selected: boolean;
  forwardRef: React.RefObject<HTMLDivElement>;
  customContent?: React.JSX.Element;
  disabled?: boolean;
  compact?: boolean;
}

export type TabSelectionRefMap = { [key: string]: React.RefObject<HTMLDivElement> };

export interface TabListWidgetState {
  selectedBounds?: TabBounds;
}

namespace S {
  export const Container = styled.div<{ compact?: boolean }>`
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    padding: ${(p) => (p.compact ? '4px 5px' : '6px 5px')};
    user-select: none;
    overflow-x: auto;

    // below styles for iPad safari
    overflow-y: hidden;
    overscroll-behavior: none;
    ::-webkit-scrollbar {
      display: none; // Safari and Chrome
    }
  `;

  export const LayerContainer = styled.div`
    position: relative;
    flex-grow: 0;
    flex-shrink: 0;
  `;

  export const SelectedBackgroundLayer = styled.div`
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  `;

  export const TabsContainer = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 1;
    flex-grow: 0;
    flex-shrink: 0;
  `;

  export const TabBadgeContainer = styled.div`
    position: relative;
  `;
}

export class TabListWidget<T extends TabListWidgetProps = TabListWidgetProps> extends React.Component<
  T,
  TabListWidgetState
> {
  tabRefs: TabSelectionRefMap;
  containerRef: React.RefObject<HTMLDivElement>;
  resizeObserver?: ResizeObserver;

  constructor(props: T) {
    super(props);
    this.tabRefs = {};
    this.containerRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    this.attachObserver();
  }

  componentDidUpdate(prevProps: T) {
    if (prevProps.selected !== this.props.selected || prevProps.tabs !== this.props.tabs) {
      this.attachObserver();
    } else if (this.shouldMeasureSelectedTab()) {
      this.updateSelectedBounds();
    }
  }

  componentWillUnmount() {
    this.resizeObserver?.disconnect();
  }

  attachObserver = () => {
    this.resizeObserver?.disconnect();

    if (!this.shouldMeasureSelectedTab()) {
      return;
    }

    const selectedRef = this.tabRefs[this.props.selected]?.current;
    const container = this.containerRef.current;
    if (!selectedRef || !container) {
      this.updateSelectedBounds();
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.updateSelectedBounds();
    });
    this.resizeObserver.observe(selectedRef);
    this.resizeObserver.observe(container);
    this.updateSelectedBounds();
  };

  shouldMeasureSelectedTab = () => {
    return !!this.props.selectedBackgroundGenerator || !!this.props.selectedBoundsUpdated;
  };

  updateSelectedBounds = () => {
    if (!this.shouldMeasureSelectedTab()) {
      return;
    }

    const selectedRef = this.tabRefs[this.props.selected]?.current;
    const container = this.containerRef.current;
    if (!selectedRef || !container) {
      if (this.state.selectedBounds) {
        this.setState({ selectedBounds: undefined });
      }
      return;
    }

    const selectedBounds = selectedRef.getBoundingClientRect();
    const containerBounds = container.getBoundingClientRect();
    const bounds = {
      left: selectedBounds.left - containerBounds.left,
      top: selectedBounds.top - containerBounds.top,
      width: selectedBounds.width,
      height: selectedBounds.height
    };

    this.props.selectedBoundsUpdated?.({
      left: selectedBounds.left,
      width: selectedBounds.width
    });

    const current = this.state.selectedBounds;
    if (
      !current ||
      Math.abs(current.left - bounds.left) > 0.5 ||
      Math.abs(current.top - bounds.top) > 0.5 ||
      Math.abs(current.width - bounds.width) > 0.5 ||
      Math.abs(current.height - bounds.height) > 0.5
    ) {
      this.setState({ selectedBounds: bounds });
    }
  };

  render() {
    return (
      <S.Container className={this.props.className} compact={this.props.compact}>
        <S.LayerContainer ref={this.containerRef}>
          {this.props.selectedBackgroundGenerator && (
            <S.SelectedBackgroundLayer>
              {this.props.selectedBackgroundGenerator(this.state.selectedBounds)}
            </S.SelectedBackgroundLayer>
          )}
          <S.TabsContainer>
            {_.map(this.props.tabs, (tab) => {
              if (!this.tabRefs[tab.key]) {
                this.tabRefs[tab.key] = React.createRef();
              }
              const badgeDirective = this.props.badgeProvider?.(tab.key);
              return (
                <S.TabBadgeContainer key={tab.key}>
                  {badgeDirective && <TabBadgeWidget directive={badgeDirective} />}
                  {this.props.tabItemGenerator(tab, this.tabRefs[tab.key])}
                </S.TabBadgeContainer>
              );
            })}
          </S.TabsContainer>
        </S.LayerContainer>
      </S.Container>
    );
  }
}
