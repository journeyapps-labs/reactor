import * as React from 'react';
import { useAttention } from '../guide/AttentionWrapperWidget';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { ButtonComponentSelection, ReactorComponentType } from '../../stores/guide/selections/common';
import { GenericTabWidgetProps } from './GenericTabSelectionWidget';

namespace S {
  export const Tab = styled.div<{ selected: boolean; attention: boolean; disabled?: boolean }>`
    padding: 8px 13px;
    color: ${(p) => p.theme.combobox.text};
    cursor: ${(p) => (p.disabled ? 'auto' : 'pointer')};
    opacity: ${(p) => (p.attention || p.selected ? 1 : 0.5)};
    background: ${(p) => (p.selected ? p.theme.tabs.selectedBackground : 'transparent')};
    //prevents a weird ghosting border with transparent borders
    background-origin: border-box;
    font-family: 'Source Sans Pro';
    font-size: 15px;
    white-space: nowrap;
    border: ${(p) => (p.attention ? p.theme.guide.accent : `transparent`)} solid 1px;
    &:hover {
      opacity: 1;
    }
  `;
}

export const TabWidget: React.FC<GenericTabWidgetProps> = (props) => {
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
      ref={props.forwardRef}
    >
      {props.customContent || props.label}
    </S.Tab>
  );
};
