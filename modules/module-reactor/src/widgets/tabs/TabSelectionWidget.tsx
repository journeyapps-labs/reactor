import * as React from 'react';
import * as _ from 'lodash';
import { MouseEvent, useCallback, useEffect, useRef } from 'react';
import { TabWidget } from './TabWidget';
import {
  GenericTabSelectionWidget,
  TabDirection,
  TabDirective,
  TabSelectionWidgetProps
} from './GenericTabSelectionWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { useForceUpdate } from '../../hooks/useForceUpdate';

namespace S {
  export const SelectedBlock = themed.div<{ width?: number; left?: number; animate_enabled?: boolean }>`
    height: 3px;
    width: ${(p) => p.width || 0}px;
    left: ${(p) => p.left || 0}px;
    background: ${(p) => p.theme.tabs.selectedAccent};
    position: absolute;
    ${(p) =>
      p.animate_enabled
        ? 'transition: left 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        : ''};
  `;
}

const TabSelectionIndicator: React.FC<{
  selectedTabBounds: {
    left: number;
    width: number;
  };
  animate?: boolean;
  direction: TabDirection;
}> = (props) => {
  // Only show for when it's  a row layout
  if (props.direction == TabDirection.COLUMN) {
    return null;
  }

  const { selectedTabBounds } = props;
  if (!selectedTabBounds) {
    return null;
  }

  return (
    <S.SelectedBlock
      animate_enabled={props.animate ?? true}
      width={selectedTabBounds.width}
      left={selectedTabBounds.left}
    />
  );
};

export interface TabWidgetWrapperProps {
  tab: TabDirective;
  forwardRef: React.RefObject<HTMLDivElement>;
  selected: boolean;
  tabSelected: () => any;
  tabRightClick: (event: MouseEvent) => any;
  sizeUpdated: (rect: { left: number; width: number }) => any;
}

export const TabWidgetWrapper: React.FC<TabWidgetWrapperProps> = ({
  forwardRef,
  tab,
  selected,
  tabSelected,
  tabRightClick,
  sizeUpdated
}) => {
  const update = useCallback(() => {
    if (!forwardRef.current) {
      return;
    }
    const bounds = forwardRef.current.getBoundingClientRect();
    sizeUpdated({
      width: bounds.width,
      left: (forwardRef.current.offsetParent as HTMLDivElement).offsetLeft
    });
  }, [forwardRef]);

  useEffect(() => {
    const observer1 = new ResizeObserver(() => {
      update();
    });

    observer1.observe(forwardRef.current);
    update();
    return () => {
      observer1.disconnect();
    };
  }, []);

  return (
    <TabWidget
      forwardRef={forwardRef}
      label={tab.name}
      selected={selected}
      tabSelected={() => {
        tabSelected();
        _.defer(() => {
          update();
        });
      }}
      tabRightClick={tabRightClick}
      customContent={tab.tabContent?.()}
    />
  );
};

export const TabSelectionWidget: React.FC<TabSelectionWidgetProps & { animate?: boolean }> = (props) => {
  const update = useForceUpdate();
  const sizes = useRef<{ [key: string]: { left: number; width: number } }>({});
  return (
    <GenericTabSelectionWidget
      {...props}
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
            sizeUpdated={(rect) => {
              sizes.current = {
                ...sizes.current,
                [tab.key]: rect
              };
              update();
            }}
          />
        );
      }}
      tabSelectionIndicatorGenerator={(selectedTabRef, containerRef) => (
        <TabSelectionIndicator
          animate={props.animate}
          selectedTabBounds={sizes.current[props.selected]}
          direction={props.direction}
        />
      )}
    />
  );
};
