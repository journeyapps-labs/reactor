import * as React from 'react';
import styled from '@emotion/styled';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Btn } from '../../definitions/common';
import { PanelButtonMode, PanelButtonWidget } from '../../widgets/forms/PanelButtonWidget';

export interface CommandPalletCategoryWidgetProps {
  name: string;
  loading: boolean;
  showMore: string;
  showMoreAction: () => any;
  btns?: Btn[];
  close: () => any;
}

namespace S {
  export const Container = styled.div`
    margin-bottom: 20px;
  `;

  export const Title = themed.div`
    font-size: 12px;
    opacity: 0.2;
    color: ${(p) => p.theme.combobox.text};
    margin-bottom: 5px;
    margin-left: 10px;
    flex-shrink: 0;
  `;

  export const Top = styled.div`
    display: flex;
    align-self: center;
    align-items: center;
  `;

  export const Icon = themed.div`
    margin-left: 10px;
    opacity: 0.5;
    font-size: 12px;
    color: ${(p) => p.theme.combobox.text};
  `;

  export const ShowMore = themed.div`
    text-align: center;
    color: ${(p) => p.theme.combobox.text};
    padding: 10px;
    opacity: 0.5;
    cursor: pointer;

    &:hover {
      opacity: 1.0;
    }
  `;

  export const Button = styled(PanelButtonWidget)`
    img {
      max-width: 25px;
    }
  `;

  export const Buttons = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-grow: 1;
  `;
}

export class CommandPalletCategoryWidget extends React.Component<
  React.PropsWithChildren<CommandPalletCategoryWidgetProps>
> {
  getLoader() {
    if (!this.props.loading) {
      return null;
    }
    return (
      <S.Icon>
        <FontAwesomeIcon icon="spinner" spin={true} />
      </S.Icon>
    );
  }

  getButtons() {
    if (this.props.btns) {
      return (
        <S.Buttons>
          {this.props.btns.map((m) => {
            return (
              <S.Button
                key={m.label}
                {...m}
                action={(event) => {
                  this.props.close();
                  m.action(event);
                }}
                mode={PanelButtonMode.LINK}
              />
            );
          })}
        </S.Buttons>
      );
    }
    return null;
  }

  render() {
    return (
      <S.Container>
        <S.Top>
          <S.Title>{this.props.name}</S.Title>
          {this.getLoader()}

          {this.getButtons()}
        </S.Top>
        {this.props.children}
        {this.props.showMore && !this.props.loading ? (
          <S.ShowMore
            onClick={() => {
              this.props.showMoreAction();
            }}
          >
            {this.props.showMore}
          </S.ShowMore>
        ) : null}
      </S.Container>
    );
  }
}
