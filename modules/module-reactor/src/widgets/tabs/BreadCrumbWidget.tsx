import React from 'react';
import { styled, theme } from '../../stores/themes/reactor-theme-fragment';
import { GenericTabWidgetProps } from './GenericTabSelectionWidget';
import { useAttention } from '../guide/AttentionWrapperWidget';
import { ButtonComponentSelection, ReactorComponentType } from '../../stores/guide/selections/common';
import { ioc } from '../../inversify.config';
import { css } from '@emotion/react';
import { ThemeStore } from '../../stores/themes/ThemeStore';

export interface BreadCrumbWidgetProps extends GenericTabWidgetProps {
  backgroundColor: string;
}

namespace S {
  const BREAD_CRUMB_SHARED_CSS = css`
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
    position: absolute;
    top: 50%;
    margin-top: -25px;
    margin-left: 1px;
    left: 100%;
  `;

  export const BreadCrumbContainer = styled.div<
    BreadCrumbWidgetProps & { attention: boolean; crumbBackgroundColor: string }
  >`
    padding: 8px 8px 8px 28px;
    position: relative;
    color: ${(p) => p.theme.button.color};
    cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
    user-select: none;
    background-color: ${(p) => p.crumbBackgroundColor};
    font-size: 15px;
    line-height: 25px;
    white-space: nowrap;

    &:before {
      ${(p) => BREAD_CRUMB_SHARED_CSS}
      border-left: 15px solid ${(p) => p.backgroundColor};
      z-index: 1;
    }

    &:after {
      ${(p) => BREAD_CRUMB_SHARED_CSS}
      border-left: 15px solid ${(p) => p.crumbBackgroundColor};
      margin-left: -1px;
      z-index: 2;
    }
  `;

  export const BreadCrumbContent = styled.div<{ attention: boolean; disabled: boolean; selected: boolean }>`
    padding: 5px;
    opacity: ${(p) => (p.attention || p.selected ? 1 : p.disabled ? 0.2 : 0.6)};
  `;
}

export const BreadCrumbWidget: React.FC<BreadCrumbWidgetProps> = (props) => {
  const selected = useAttention<ButtonComponentSelection>({
    type: ReactorComponentType.TAB,
    forwardRef: props.forwardRef,
    selection: {
      label: props.label
    }
  });

  const currentTheme = ioc.get(ThemeStore).getCurrentTheme(theme);

  const crumbBackgroundColor: string = React.useMemo(() => {
    if (props.selected) {
      return currentTheme.panels.titleBackground;
    }

    if (props.disabled) {
      return currentTheme.forms.inputBackground;
    }

    return currentTheme.panels.searchBackground;
  }, [props.selected, props.disabled, currentTheme]);

  return (
    <S.BreadCrumbContainer
      {...props}
      crumbBackgroundColor={crumbBackgroundColor}
      attention={!!selected}
      key="test"
      selected={props.selected}
      onClick={(event) => {
        if (props.disabled) {
          return;
        }
        event.persist();
        props.tabSelected(event);
      }}
      onContextMenu={(event) => {
        if (!props.disabled && props.tabRightClick) {
          event.persist();
          event.preventDefault();
          props.tabRightClick(event);
        }
      }}
      ref={props.forwardRef}
    >
      <S.BreadCrumbContent selected={props.selected} attention={!!selected} disabled={props.disabled}>
        {props.label}
      </S.BreadCrumbContent>
    </S.BreadCrumbContainer>
  );
};
