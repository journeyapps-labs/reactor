import * as React from 'react';
import { useAttention } from '../guide/AttentionWrapperWidget';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { ButtonComponentSelection, ReactorComponentType } from '../../stores/guide/selections/common';
import { TabItemWidgetProps } from './TabListWidget';
import { Fonts } from '../../fonts';
import { MousePosition } from '../../layers/combo/SmartPositionWidget';
import { useLongPressContextMenu } from '../../hooks/useLongPressContextMenu';
import { Size } from '../../hooks/useReactorSize';

namespace S {
  export const Tab = styled.div<{
    selected: boolean;
    attention: boolean;
    disabled?: boolean;
    compact?: boolean;
    size?: Size;
    vertical?: boolean;
  }>`
    width: ${(p) => (p.vertical ? '100%' : 'auto')};
    box-sizing: border-box;
    padding: ${(p) => (p.size === Size.SMALL ? '2px 10px' : p.size === Size.LARGE ? '7px 17px' : '4px 13px')};
    color: ${(p) => p.theme.combobox.text};
    cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
    opacity: ${(p) => (p.disabled ? 0.34 : p.attention || p.selected ? 1 : 0.62)};
    background: transparent;
    font-family: ${Fonts.PRIMARY};
    font-size: ${(p) => (p.size === Size.SMALL ? '13px' : p.size === Size.LARGE ? '17px' : '15px')};
    line-height: ${(p) => (p.size === Size.SMALL ? '15px' : 'normal')};
    white-space: nowrap;
    border: 0;
    border-radius: ${(p) => (p.size === Size.SMALL ? '5px' : p.size === Size.LARGE ? '8px' : '6px')};
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

  const showContextMenu = React.useCallback(
    (position: MousePosition) => {
      if (props.disabled || !props.tabRightClick) {
        return;
      }
      props.tabRightClick(position);
    },
    [props.disabled, props.tabRightClick]
  );
  useLongPressContextMenu(props.forwardRef, showContextMenu, props.disabled || !props.tabRightClick);

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
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      ref={props.forwardRef}
      disabled={props.disabled}
      compact={props.compact}
      size={props.size}
      vertical={props.vertical}
    >
      {props.customContent || props.label}
    </S.Tab>
  );
};
