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

export enum TabDirection {
  ROW = 'row',
  COLUMN = 'column'
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
  className?;
  direction?: TabDirection;
  badgeProvider?: (key: string) => TabBadgeDirective;
}

export interface GenericTabSelectionWidgetProps extends TabSelectionWidgetProps {
  tabItemGenerator: (tab: TabDirective, ref: React.RefObject<HTMLDivElement>) => React.JSX.Element;
  tabSelectionIndicatorGenerator: (
    selectedRef: React.RefObject<HTMLDivElement>,
    indicatorContainerRef: React.RefObject<HTMLDivElement>
  ) => React.JSX.Element;
}

export interface GenericTabWidgetProps {
  tabSelected: (event: MouseEvent) => any;
  tabRightClick: (event: MouseEvent) => any;
  label: string;
  selected: boolean;
  forwardRef: React.RefObject<HTMLDivElement>;
  customContent?: React.JSX.Element;
  disabled?: boolean;
}

export type GenericTabSelectionRefMap = { [key: string]: React.RefObject<HTMLDivElement> };

namespace S {
  export const Container = styled.div`
    display: flex;
    flex-direction: column;
    user-select: none;
    overflow-x: auto;

    // below styles for iPad safari
    overflow-y: hidden;
    overscroll-behavior: none;
    ::-webkit-scrollbar {
      display: none; // Safari and Chrome
    }
  `;

  export const TabsContainer = styled.div<{ direction?: TabDirection }>`
    display: flex;
    flex-direction: ${(p) => p.direction ?? TabDirection.ROW};
    position: relative;
    flex-grow: 0;
    flex-shrink: 0;
  `;

  export const TabBadgeContainer = styled.div`
    position: relative;
  `;

  export const TabIndicatorContainer = styled.div`
    position: relative;
    height: 3px;
  `;
}

export class GenericTabSelectionWidget<
  T extends GenericTabSelectionWidgetProps = GenericTabSelectionWidgetProps
> extends React.Component<T> {
  tabRefs: GenericTabSelectionRefMap;
  tabIndicatorRef: React.RefObject<HTMLDivElement>;

  constructor(props: T) {
    super(props);
    this.tabRefs = {};
    this.tabIndicatorRef = React.createRef();
  }

  render() {
    return (
      <S.Container className={this.props.className}>
        <S.TabsContainer direction={this.props.direction}>
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
        <S.TabIndicatorContainer ref={this.tabIndicatorRef}>
          {this.props.tabSelectionIndicatorGenerator(this.tabRefs[this.props.selected], this.tabIndicatorRef)}
        </S.TabIndicatorContainer>
      </S.Container>
    );
  }
}
