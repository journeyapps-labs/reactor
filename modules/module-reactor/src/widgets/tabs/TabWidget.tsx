import * as React from 'react';
import { useAttention } from '../guide/AttentionWrapperWidget';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { ButtonComponentSelection, ReactorComponentType } from '../../stores/guide/selections/common';
import { TabItemWidgetProps } from './TabListWidget';
import { Fonts } from '../../fonts';

namespace S {
  export const Tab = styled.div<{
    selected: boolean;
    attention: boolean;
    disabled?: boolean;
    compact?: boolean;
    vertical?: boolean;
  }>`
    width: ${(p) => (p.vertical ? '100%' : 'auto')};
    box-sizing: border-box;
    padding: ${(p) => (p.compact ? '4px 10px' : '4px 13px')};
    color: ${(p) => p.theme.combobox.text};
    cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
    opacity: ${(p) => (p.disabled ? 0.34 : p.attention || p.selected ? 1 : 0.62)};
    background: transparent;
    font-family: ${Fonts.PRIMARY};
    font-size: ${(p) => (p.compact ? '13px' : '15px')};
    line-height: ${(p) => (p.compact ? '11px' : 'normal')};
    white-space: nowrap;
    border: 0;
    border-radius: 5px;
    outline: ${(p) => (p.attention ? p.theme.guide.accent : `transparent`)} solid 1px;
    outline-offset: -1px;
    &:hover {
      opacity: ${(p) => (p.disabled ? 0.34 : 1)};
    }
  `;
}

export const TabWidget: React.FC<TabItemWidgetProps> = (props) => {
  const selected = useAttention<ButtonComponentSelection>({
    type: ReactorComponentType.TAB,
    forwardRef: props.forwardRef,
    selection: {
      label: props.label
    }
  });
  return (
    <S.Tab
      attention={!!selected}
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
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      ref={props.forwardRef}
      disabled={props.disabled}
      compact={props.compact}
      vertical={props.vertical}
    >
      {props.customContent || props.label}
    </S.Tab>
  );
};
