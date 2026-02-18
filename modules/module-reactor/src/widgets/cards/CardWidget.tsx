import * as React from 'react';
import { JSX } from 'react';
import styled from '@emotion/styled';
import { PanelBtn, PanelButtonWidget } from '../forms/PanelButtonWidget';
import { Observer } from 'mobx-react';
import { FooterLoaderWidget } from '../footer/FooterLoaderWidget';
import { LoadingDirectiveState } from '../../stores';
import { MetaBarWidget } from '../meta/MetaBarWidget';
import { ReadOnlyMetadataWidgetProps } from '../meta/ReadOnlyMetadataWidget';
import { getDarkenedColor, getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface CardWidgetProps {
  btns?: PanelBtn[];
  title: string | React.JSX.Element;
  subHeading?: string | React.JSX.Element;
  color?: string;
  subHeadingColor?: string;
  selected?: boolean;
  selectedBorderColor?: string;
  className?;
  sections: { content: () => React.JSX.Element | null; key: string }[];
  loader?: {
    color?: string;
    percentage: number;
    meta?: ReadOnlyMetadataWidgetProps[];
  };
}

export const CardTop = styled.div`
  display: flex;
  padding: 10px;
`;

export const CardContent = themed.div`
  flex-grow: 1;
  border-top: solid 1px ${(p) => getTransparentColor(p.theme.cards.border, 0.4)};
  padding: 10px;
  min-width: 0;
  overflow-x: auto;
`;

namespace S {
  export const Container = themed.div<{ selected?: boolean; selectedBorderColor?: string }>`
    border-radius: 5px;
    background: ${(p) => p.theme.cards.background};
    border: solid 1px
      ${(p) => (p.selected ? p.selectedBorderColor || p.theme.tabs.selectedAccentSingle : p.theme.cards.border)};
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

  export const Top = CardTop;

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

  export const Content = CardContent;

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

  getSubHeading() {
    if (!this.props.subHeading) {
      return null;
    }
    if (React.isValidElement(this.props.subHeading)) {
      return this.props.subHeading;
    }
    return <S.Subtitle color={this.props.subHeadingColor || this.props.color}>{this.props.subHeading}</S.Subtitle>;
  }

  render() {
    return (
      <S.Container
        className={this.props.className}
        selected={this.props.selected}
        selectedBorderColor={this.props.selectedBorderColor}
      >
        <S.Top>
          <S.Info>
            {this.getTitle()}
            {this.getSubHeading()}
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
              <Observer
                key={section.key}
                render={() => {
                  const content = section.content();
                  if (!content) {
                    return null;
                  }
                  return <S.Content>{content}</S.Content>;
                }}
              />
            );
          })}
        </>
        {this.getLoader()}
      </S.Container>
    );
  }
}
