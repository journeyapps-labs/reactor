import * as React from 'react';
import { MouseEvent } from 'react';

import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { IconWidget } from '../../widgets/icons/IconWidget';
import { css } from '@emotion/react';
import { AttentionWrapperWidget } from '../../widgets/guide/AttentionWrapperWidget';
import { ButtonComponentSelection, ReactorComponentType } from '../../stores/guide/selections/common';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { COMBOBOX_ITEM_H_PADDING } from '../../layout';
import * as _ from 'lodash';
import { Dimensions, useDimensionObserver } from '../../hooks/useDimensionObserver';

export interface ComboBoxItemWidgetProps {
  item: ComboBoxItem;
  selected: boolean;
  forwardRef: React.RefObject<any>;
  onMouseClick: (event: MouseEvent) => any;
  onMouseOver?: (event: MouseEvent) => any;
  gotDimensions?: (dimensions: Dimensions) => any;
}

namespace S {
  export const Badge = themed.div<{ background: string; color: string }>`
    font-size: 11px;
    border-radius: 3px;
    margin-left: 10px;
    padding: 3px 5px;
    cursor: pointer;
    background: ${(p) => p.background};
    color: ${(p) => p.color};
  `;

  const shared = css`
    font-size: 13px;
    padding: 4px ${COMBOBOX_ITEM_H_PADDING}px;
    cursor: pointer;
    transition:
      background-color 0.2s,
      color 0.2s;
    display: flex;
    align-items: center;
  `;

  export const Item = themed.div<{ selected: boolean; attention: boolean }>`
    ${shared};
    color: ${(p) => (p.selected ? p.theme.combobox.textSelected : p.theme.combobox.text)};
    border-radius: ${(p) => (p.selected ? 4 : 0)}px;
    background: ${(p) => (p.selected ? p.theme.combobox.backgroundSelected : 'transparent')};
    ${(p) => (p.attention ? `border: solid 1px ${p.theme.guide.accent}` : ``)};
  `;

  export const Link = themed.a<{ selected: boolean; attention: boolean }>`
    ${shared};
    color: ${(p) => (p.selected ? p.theme.combobox.textSelected : p.theme.combobox.text)};
    border-radius: ${(p) => (p.selected ? 4 : 0)}px;
    background: ${(p) => (p.selected ? p.theme.combobox.backgroundSelected : 'transparent')};
    text-decoration: none;
    ${(p) => (p.attention ? `border: solid 1px ${p.theme.guide.accent}` : ``)};
  `;

  export const Icon = themed.div<{ color: string; selected: boolean }>`
    color: ${(p) => (p.selected ? p.theme.combobox.textSelected : p.color || p.theme.combobox.text)};
    opacity: ${(p) => (p.selected ? 1 : p.color ? 1 : 0.3)};
    margin-right: 5px;
    display: flex;
    width: 16px;
  `;

  export const IconInner = themed(IconWidget)`
    max-height: 15px;
  `;

  export const Label = themed.div<{ disabled: boolean }>`
    opacity: ${(p) => (p.disabled ? 0.3 : 1)};
    flex-grow: 1;
  `;

  export const Right = themed.div`
    flex-grow: 1;
    justify-content: flex-end;
    align-items: center;
    display: flex;
    column-gap: 8px;
    padding-left: 20px;
  `;

  export const ChildIndicator = themed.div`
    opacity: 0.65;
    display: flex;
    align-items: center;
  `;
}

interface ItemContentProps {
  item: ComboBoxItem;
  selected: boolean;
  children?: React.ReactNode;
}

const ItemContent: React.FC<ItemContentProps> = (props) => {
  return (
    <>
      {props.children}
      {props.item.icon ? (
        <S.Icon selected={props.selected} color={props.item.color}>
          <S.IconInner icon={props.item.icon} />
        </S.Icon>
      ) : null}
      <S.Label disabled={props.item.disabled}>{props.item.title}</S.Label>
      {props.item.badge ? (
        <S.Badge
          color={props.item.badge.foreground}
          background={props.item.badge.background}
          onClick={(event) => {
            if (props.item.badge.action) {
              event.stopPropagation();
              props.item.badge.action(event);
            }
          }}
        >
          {props.item.badge.label}
        </S.Badge>
      ) : null}
    </>
  );
};

const RightContent: React.FC<{ item: ComboBoxItem }> = (props) => {
  const hasCustomRight = !!props.item.right;
  const hasChildren = !!props.item.children?.length;

  if (!hasCustomRight && !hasChildren) {
    return null;
  }

  return (
    <S.Right>
      {hasCustomRight ? props.item.right : null}
      {hasChildren ? (
        <S.ChildIndicator>
          <IconWidget icon="angle-right" />
        </S.ChildIndicator>
      ) : null}
    </S.Right>
  );
};

interface RowProps {
  item: ComboBoxItem;
  selected: boolean;
  attention: boolean;
  rowRef: React.RefObject<any>;
  onMouseClick: (event: MouseEvent) => any;
  onMouseOver?: (event: MouseEvent) => any;
  children?: React.ReactNode;
}

const ComboBoxItemRow: React.FC<RowProps> = (props) => {
  const onClick = (event: MouseEvent) => {
    event.persist();
    event.stopPropagation();
    props.onMouseClick(event);
  };

  if (props.item.download) {
    return (
      <S.Link
        attention={props.attention}
        onClick={onClick}
        onMouseOver={props.onMouseOver}
        download={props.item.download.name}
        href={props.item.download.url}
        ref={props.rowRef}
        selected={props.selected}
      >
        <ItemContent item={props.item} selected={props.selected}>
          {props.children}
        </ItemContent>
      </S.Link>
    );
  }

  return (
    <S.Item
      attention={props.attention}
      onClick={onClick}
      onMouseOver={props.onMouseOver}
      ref={props.rowRef}
      selected={props.selected}
    >
      <ItemContent item={props.item} selected={props.selected}>
        {props.children}
      </ItemContent>
      <RightContent item={props.item} />
    </S.Item>
  );
};

export const ComboBoxItemWidget: React.FC<React.PropsWithChildren<ComboBoxItemWidgetProps>> = (props) => {
  const localRef = React.useRef<HTMLDivElement>(null);
  const scrolledRef = React.useRef(false);
  const rowRef = props.forwardRef || localRef;

  useDimensionObserver({
    element: rowRef,
    changed: (dimensions) => {
      props.gotDimensions?.(dimensions);
    }
  });

  return (
    <AttentionWrapperWidget<ButtonComponentSelection>
      selection={{
        label: props.item.title
      }}
      forwardRef={rowRef}
      type={ReactorComponentType.COMBO_BOX_ITEM}
      activated={(attention) => {
        if (!scrolledRef.current && !!attention) {
          _.defer(() => {
            rowRef?.current?.scrollIntoView();
          });
          scrolledRef.current = true;
        }

        return (
          <ComboBoxItemRow
            item={props.item}
            selected={props.selected}
            attention={!!attention}
            rowRef={rowRef}
            onMouseClick={props.onMouseClick}
            onMouseOver={props.onMouseOver}
          >
            {props.children}
          </ComboBoxItemRow>
        );
      }}
    />
  );
};
