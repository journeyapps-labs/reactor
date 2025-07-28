import * as React from 'react';
import { BreadCrumbWidget } from './BreadCrumbWidget';
import { ioc } from '../../inversify.config';
import { GenericTabSelectionWidget, TabDirective, TabSelectionWidgetProps } from './GenericTabSelectionWidget';
import { ThemeStore } from '../../stores/themes/ThemeStore';
import { theme } from '../../stores/themes/reactor-theme-fragment';

export interface BreadCrumbTabSelectionWidgetProps extends TabSelectionWidgetProps {
  limitSelectionProgression: boolean; // Used to limit the user from moving forward by selecting proceeding tabs
}

export const BreadCrumbTabSelectionWidget: React.FC<BreadCrumbTabSelectionWidgetProps> = (props) => {
  return (
    <GenericTabSelectionWidget
      {...props}
      tabItemGenerator={(tab: TabDirective, ref: React.RefObject<HTMLDivElement>) => {
        const selected = tab.key === props.selected;
        const selectedIndex = props.tabs.findIndex((search) => search.key == props.selected);
        const thisTabIndex = props.tabs.findIndex((search) => search.key == tab.key);

        return (
          <BreadCrumbWidget
            disabled={props.limitSelectionProgression && thisTabIndex > selectedIndex + 1}
            backgroundColor={ioc.get(ThemeStore).getCurrentTheme(theme).panels.background}
            forwardRef={ref}
            label={tab.name}
            key={tab.key}
            selected={selected}
            tabSelected={() => {
              props.tabSelected(tab.key);
            }}
            tabRightClick={(event) => {
              props.tabRightClick?.(event, tab);
            }}
            customContent={tab.tabContent?.()}
          />
        );
      }}
      tabSelectionIndicatorGenerator={() => null}
    />
  );
};
