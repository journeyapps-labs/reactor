import * as React from 'react';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/react';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { inject } from '../../inversify.config';
import { Btn } from '../../definitions/common';
import { IconWidget } from '../icons/IconWidget';

export interface HeaderButtonWidgetProps {
  btn: Btn;
  badgeColor?: string;
  remove: () => any;
  vertical: boolean;
}

const BADGE_SIZE = 20;

namespace S {
  export const Container = styled.div<{ vertical: boolean }>`
    margin-bottom: ${(p) => (p.vertical ? 5 : 0)}px;
    margin-right: ${(p) => (p.vertical ? 0 : 5)}px;
  `;
  export const Btn = styled.div`
    min-width: 32px;
    min-height: 26px;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.5);
    line-height: 28px;
    text-align: center;
    vertical-align: middle;
    font-size: 13px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: solid 1px ${(props) => props.color};

    &:hover {
      color: white;
      background: rgba(0, 0, 0, 0.4);
    }
  `;

  // export const Badge = styled.div`
  //   background-color: ${(props) => props.color};
  //   width: ${BADGE_SIZE}px;
  //   height: ${BADGE_SIZE}px;
  //   right: -${BADGE_SIZE / 2}px;
  //   top: -${BADGE_SIZE / 2}px;
  //   position: absolute;
  //   transform: rotate(-45deg);
  // `;
}

export class HeaderButtonWidget extends React.Component<HeaderButtonWidgetProps> {
  @inject(ComboBoxStore)
  accessor uxStore: ComboBoxStore;

  render() {
    const name = `tooltip-entity-btn-${this.props.btn.tooltip}`;
    return (
      <S.Container
        vertical={this.props.vertical}
        aria-label={this.props.btn.tooltip}
        data-balloon-pos={this.props.vertical ? 'right' : 'down'}
        className={name}
      >
        <Global
          styles={css`
            .${name} {
              --balloon-color: ${this.props.badgeColor};
            }
          `}
        />
        <S.Btn
          onContextMenu={async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const selection = await this.uxStore.showComboBox(
              [{ title: 'Delete', key: 'delete', children: [] }],
              event
            );
            if (selection) {
              this.props.remove();
            }
          }}
          draggable={true}
          ref={this.props.btn.forwardRef}
          color={this.props.badgeColor || 'transparent'}
          onClick={(event) => {
            event.persist();
            this.props.btn.action(event);
          }}
        >
          {/*{this.props.badgeColor && <S.Badge color={this.props.badgeColor} />}*/}
          <IconWidget icon={this.props.btn.icon} />
        </S.Btn>
      </S.Container>
    );
  }
}
