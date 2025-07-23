import * as React from 'react';
import { JSX } from 'react';
import styled from '@emotion/styled';
import { PanelBtn, PanelButtonWidget } from '../forms/PanelButtonWidget';
import { Observer } from 'mobx-react';
import { FooterLoaderWidget } from '../footer/FooterLoaderWidget';
import { LoadingDirectiveState } from '../../stores';
import { MetaBarWidget } from '../meta/MetaBarWidget';
import { ReadOnlyMetadataWidgetProps } from '../meta/ReadOnlyMetadataWidget';
import { getDarkenedColor } from '@journeyapps-labs/lib-reactor-utils';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface CardWidgetProps {
  btns?: PanelBtn[];
  title: string | React.JSX.Element;
  subHeading?: string;
  color?: string;
  className?;
  sections: { content: () => React.JSX.Element; key: string }[];
  loader?: {
    color?: string;
    percentage: number;
    meta?: ReadOnlyMetadataWidgetProps[];
  };
}

namespace S {
  export const Container = themed.div`
    border-radius: 5px;
    background: ${(p) => p.theme.cards.background};
    border: solid 1px ${(p) => p.theme.cards.border};
    display: flex;
    flex-direction: column;
  `;

  export const LoadingBar = styled(FooterLoaderWidget)`
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    overflow: hidden;
  `;

  export const Loading = themed.div`
    background: ${(p) => getDarkenedColor(p.theme.cards.background, 0.3)};
  `;

  export const LoadingMeta = themed(MetaBarWidget)`
    padding-top: 5px;
    padding-left: 5px;
  `;

  export const Top = styled.div`
    display: flex;
    padding: 10px;
  `;

  export const Info = styled.div`
    flex-grow: 1;
  `;

  export const Title = themed.div`
    font-size: 14px;
    font-weight: bold;
    color: ${(p) => p.theme.cards.foreground};
  `;

  export const Subtitle = themed.div<{ color?: string }>`
    font-size: 12px;
    color: ${(p) => p.color || p.theme.cards.foreground};
  `;

  export const Content = themed.div`
    flex-grow: 1;
    border-top: solid 1px ${(p) => p.theme.panels.background};
    padding: 10px;
  `;

  export const Buttons = styled.div`
    display: flex;
    align-items: center;
  `;

  export const Button = themed(PanelButtonWidget)`
    margin-left: 5px;
  `;
}

export class CardWidget extends React.Component<CardWidgetProps> {
  getLoader() {
    if (!this.props.loader) {
      return null;
    }
    return (
      <S.Loading>
        {this.props.loader.meta?.length > 0 ? <S.LoadingMeta meta={this.props.loader.meta} /> : null}
        <S.LoadingBar
          mode={LoadingDirectiveState.LOADING}
          color={this.props.loader.color}
          show={true}
          percentage={this.props.loader.percentage}
        />
      </S.Loading>
    );
  }

  getTitle() {
    if (React.isValidElement(this.props.title)) {
      return this.props.title;
    }
    return <S.Title>{this.props.title}</S.Title>;
  }

  render() {
    return (
      <S.Container className={this.props.className}>
        <S.Top>
          <S.Info>
            {this.getTitle()}
            {this.props.subHeading ? <S.Subtitle color={this.props.color}>{this.props.subHeading}</S.Subtitle> : null}
          </S.Info>
          <S.Buttons>
            {this.props.btns?.map((btn, index) => {
              return <S.Button key={btn.label || `${index}`} {...btn} />;
            })}
          </S.Buttons>
        </S.Top>
        <>
          {this.props.sections.map((section) => {
            if (!section) {
              return null;
            }
            return (
              <S.Content key={section.key}>
                <Observer render={section.content} />
              </S.Content>
            );
          })}
        </>
        {this.getLoader()}
      </S.Container>
    );
  }
}
