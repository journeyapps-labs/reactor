import * as React from 'react';
import { MouseEvent } from 'react';
import { TabWidget } from './TabWidget';
import { TabBounds, TabDirective, TabListWidget, TabSelectionWidgetProps } from './TabListWidget';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { IconWidget } from '../icons/IconWidget';

namespace S {
  export const SelectedBackground = themed.div<{ bounds?: TabBounds }>`
    position: absolute;
    top: 0;
    left: 0;
    width: ${(p) => p.bounds?.width ?? 0}px;
    height: ${(p) => p.bounds?.height ?? 0}px;
    border-radius: 5px;
    background: ${(p) => p.theme.tabs.selectedBackground};
    opacity: ${(p) => (p.bounds ? 1 : 0)};
    transform: translate3d(${(p) => p.bounds?.left ?? 0}px, ${(p) => p.bounds?.top ?? 0}px, 0);
    transition:
      transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      width 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      height 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 0.1s ease-out;
  `;

  export const Content = styled.span<{ vertical?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
    width: ${(p) => (p.vertical ? '100%' : 'auto')};
  `;

  export const Main = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  `;

  export const Label = styled.span`
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  `;

  export const Right = styled.span`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  `;

  export const Icon = styled(IconWidget)`
    flex-shrink: 0;
    opacity: 0.85;
  `;
}

export interface TabWidgetWrapperProps {
  tab: TabDirective;
  forwardRef: React.RefObject<HTMLDivElement>;
  selected: boolean;
  tabSelected: () => any;
  tabRightClick: (event: MouseEvent) => any;
  compact?: boolean;
  vertical?: boolean;
  tabMouseEnter?: (event: MouseEvent) => any;
  tabMouseLeave?: (event: MouseEvent) => any;
}

export const TabWidgetWrapper: React.FC<TabWidgetWrapperProps> = ({
  forwardRef,
  tab,
  selected,
  tabSelected,
  tabRightClick,
  compact,
  vertical,
  tabMouseEnter,
  tabMouseLeave
}) => {
  const content = tab.tabContent?.() || (
    <S.Content vertical={vertical}>
      <S.Main>
        {tab.icon ? <S.Icon icon={tab.icon} /> : null}
        <S.Label>{tab.name}</S.Label>
      </S.Main>
      {tab.rightContent ? <S.Right>{tab.rightContent()}</S.Right> : null}
    </S.Content>
  );

  return (
    <TabWidget
      forwardRef={forwardRef}
      label={tab.name}
      selected={selected}
      tabSelected={() => {
        tabSelected();
      }}
      tabRightClick={tabRightClick}
      customContent={content}
      disabled={tab.disabled}
      compact={compact}
      vertical={vertical}
      onMouseEnter={tabMouseEnter}
      onMouseLeave={tabMouseLeave}
    />
  );
};

export const TabSelectionWidget: React.FC<TabSelectionWidgetProps> = (props) => {
  return (
    <TabListWidget
      {...props}
      selectedBackgroundGenerator={(bounds) => <S.SelectedBackground bounds={bounds} />}
      tabItemGenerator={(tab: TabDirective, ref: React.RefObject<HTMLDivElement>) => {
        return (
          <TabWidgetWrapper
            tab={tab}
            selected={tab.key === props.selected}
            key={tab.key}
            forwardRef={ref}
            tabSelected={() => {
              props.tabSelected(tab.key);
            }}
            tabRightClick={(event) => {
              props.tabRightClick?.(event, tab);
            }}
            tabMouseEnter={(event) => {
              tab.tabMouseEnter?.(event, tab);
            }}
            tabMouseLeave={(event) => {
              tab.tabMouseLeave?.(event, tab);
            }}
            compact={props.compact}
            vertical={props.vertical}
          />
        );
      }}
    />
  );
};
