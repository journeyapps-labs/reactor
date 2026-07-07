import * as React from 'react';
import { JSX } from 'react';
import styled from '@emotion/styled';
import { PanelBtn, PanelButtonWidget } from '../forms/PanelButtonWidget';
import { Observer } from 'mobx-react';
import { FooterLoaderWidget } from '../footer/FooterLoaderWidget';
import { LoadingDirectiveState } from '../../stores/visor/VisorLoadingDirective';
import { MetaBarWidget } from '../meta/MetaBarWidget';
import { ReadOnlyMetadataWidgetProps } from '../meta/ReadOnlyMetadataWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { getScrollableCSS } from '../panel/panel/PanelWidget';
import { SurfaceDepth, SurfaceWidget } from '../surfaces/SurfaceWidget';

export interface CardWidgetProps {
  btns?: PanelBtn[];
  title: string | React.JSX.Element;
  subHeading?: string | React.JSX.Element;
  color?: string;
  subHeadingColor?: string;
  selected?: boolean;
  depth?: SurfaceDepth;
  className?;
  sections: { content: () => React.JSX.Element | null; grow?: boolean; key: string }[];
  loader?: {
    color?: string;
    percentage: number;
    meta?: ReadOnlyMetadataWidgetProps[];
  };
}

namespace S {
  export const Container = styled(SurfaceWidget)`
    display: flex;
    flex-direction: column;
  `;

  export const LoadingBar = styled(FooterLoaderWidget)`
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    overflow: hidden;
  `;

  export const Loading = themed.div`
    background: ${(p) => p.theme.surfaces.depth1Background};
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

  export const Content = themed.div<{ grow: boolean }>`
    flex-grow: ${(p) => (p.grow ? 1 : 0)};
    border-top: solid 1px;
    border-color: inherit;
    padding: 10px;
    min-width: 0;
    overflow-x: auto;
    ${(p) => getScrollableCSS(p.theme)};
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
      <S.Container className={this.props.className} depth={this.props.depth} selected={this.props.selected}>
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
                  return <S.Content grow={section.grow ?? true}>{content}</S.Content>;
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
