import * as React from 'react';

import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { IconWidget } from '../../widgets/icons/IconWidget';
import { MouseEvent } from 'react';
import { css } from '@emotion/react';
import { AttentionWrapperWidget } from '../../widgets/guide/AttentionWrapperWidget';
import { ButtonComponentSelection, ReactorComponentType } from '../../stores/guide/selections/common';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { COMBOBOX_ITEM_H_PADDING } from '../../layout';

export interface ComboBoxItemWidgetProps {
  item: ComboBoxItem;
  selected: boolean;
  selectedEvent: (event: MouseEvent) => any;
  forwardRef: React.RefObject<any>;
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
    padding: 8px ${COMBOBOX_ITEM_H_PADDING}px;
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
    padding-left: 20px;
  `;
}

export class ComboBoxItemWidget extends React.Component<React.PropsWithChildren<ComboBoxItemWidgetProps>> {
  ref: React.RefObject<HTMLDivElement>;
  scrolled?: boolean;

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  getIcon() {
    if (this.props.item.icon) {
      return (
        <S.Icon selected={this.props.selected} color={this.props.item.color}>
          <S.IconInner icon={this.props.item.icon} />
        </S.Icon>
      );
    }
    return null;
  }

  getContent() {
    return (
      <>
        {this.props.children}
        {this.getIcon()}
        <S.Label disabled={this.props.item.disabled}>{this.props.item.title}</S.Label>
        {this.getBadge()}
      </>
    );
  }

  getRef() {
    return this.props.forwardRef || this.ref;
  }

  getBadge() {
    if (this.props.item.badge) {
      return (
        <S.Badge
          color={this.props.item.badge.foreground}
          background={this.props.item.badge.background}
          onClick={(event) => {
            if (this.props.item.badge.action) {
              event.stopPropagation();
              this.props.item.badge.action(event);
            }
          }}
        >
          {this.props.item.badge.label}
        </S.Badge>
      );
    }
    return null;
  }

  getItem(selected: boolean) {
    if (this.props.item.download) {
      return (
        <S.Link
          attention={selected}
          onClick={(event) => {
            event.persist();
            event.stopPropagation();
            this.props.selectedEvent(event);
          }}
          download={this.props.item.download.name}
          href={this.props.item.download.url}
          {...this.props}
          ref={this.getRef()}
          selected={this.props.selected}
        >
          {this.getContent()}
        </S.Link>
      );
    }
    return (
      <S.Item
        attention={selected}
        onClick={(event) => {
          event.persist();
          event.stopPropagation();
          this.props.selectedEvent(event);
        }}
        {...this.props}
        ref={this.getRef()}
        selected={this.props.selected}
      >
        {this.getContent()}
        {this.props.item.right ? <S.Right>{this.props.item.right}</S.Right> : null}
      </S.Item>
    );
  }

  render() {
    return (
      <AttentionWrapperWidget<ButtonComponentSelection>
        selection={{
          label: this.props.item.title
        }}
        forwardRef={this.getRef()}
        type={ReactorComponentType.COMBO_BOX_ITEM}
        activated={(selected) => {
          if (!this.scrolled && !!selected) {
            this.getRef()?.current?.scrollIntoView();
            this.scrolled = true;
          }
          return this.getItem(!!selected);
        }}
      />
    );
  }
}
