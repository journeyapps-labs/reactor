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
import { getReactorBorderRadius, ReactorSizeProvider, Size, useReactorSize } from '../../hooks/useReactorSize';

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
  size?: Size;
}

namespace S {
  export const Container = styled(SurfaceWidget)<{ $size: Size }>`
    display: flex;
    flex-direction: column;
    user-select: none;
    border-radius: ${(p) => getReactorBorderRadius(p.$size)}px;
  `;

  export const LoadingBar = styled(FooterLoaderWidget)<{ $size: Size }>`
    border-bottom-left-radius: ${(p) => (p.$size === Size.LARGE ? '10px' : p.$size === Size.MEDIUM ? '8px' : '5px')};
    border-bottom-right-radius: ${(p) => (p.$size === Size.LARGE ? '10px' : p.$size === Size.MEDIUM ? '8px' : '5px')};
    overflow: hidden;
  `;

  export const Loading = themed.div`
    background: ${(p) => p.theme.surfaces.depth1Background};
  `;

  export const LoadingMeta = themed(MetaBarWidget)`
    padding-top: 5px;
    padding-left: 5px;
  `;

  export const Top = styled.div<{ $size: Size }>`
    display: flex;
    padding: ${(p) => (p.$size === Size.SMALL ? '10px' : p.$size === Size.LARGE ? '16px' : '12px')};
  `;

  export const Info = styled.div`
    flex-grow: 1;
  `;

  export const Title = themed.div<{ $size: Size }>`
    font-size: ${(p) => (p.$size === Size.SMALL ? '14px' : p.$size === Size.LARGE ? '18px' : '16px')};
    font-weight: bold;
    color: ${(p) => p.theme.cards.foreground};
  `;

  export const Subtitle = themed.div<{ color?: string; $size: Size }>`
    font-size: ${(p) => (p.$size === Size.SMALL ? '12px' : p.$size === Size.LARGE ? '15px' : '13px')};
    color: ${(p) => p.color || p.theme.cards.foreground};
  `;

  export const Content = themed.div<{ grow: boolean; $size: Size }>`
    flex-grow: ${(p) => (p.grow ? 1 : 0)};
    border-top: solid 1px;
    border-color: inherit;
    padding: ${(p) => (p.$size === Size.SMALL ? '10px' : p.$size === Size.LARGE ? '16px' : '12px')};
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

class CardWidgetInternal extends React.Component<CardWidgetProps & { resolvedSize: Size }> {
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
          $size={this.props.resolvedSize}
        />
      </S.Loading>
    );
  }

  getTitle() {
    if (React.isValidElement(this.props.title)) {
      return this.props.title;
    }
    return <S.Title $size={this.props.resolvedSize}>{this.props.title}</S.Title>;
  }

  getSubHeading() {
    if (!this.props.subHeading) {
      return null;
    }
    if (React.isValidElement(this.props.subHeading)) {
      return this.props.subHeading;
    }
    return (
      <S.Subtitle color={this.props.subHeadingColor || this.props.color} $size={this.props.resolvedSize}>
        {this.props.subHeading}
      </S.Subtitle>
    );
  }

  render() {
    return (
      <S.Container
        className={this.props.className}
        depth={this.props.depth}
        selected={this.props.selected}
        $size={this.props.resolvedSize}
      >
        <S.Top $size={this.props.resolvedSize}>
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
                  return (
                    <S.Content grow={section.grow ?? true} $size={this.props.resolvedSize}>
                      {content}
                    </S.Content>
                  );
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

export const CardWidget: React.FC<CardWidgetProps> = (props) => {
  const size = useReactorSize(props.size);

  return (
    <ReactorSizeProvider size={size}>
      <CardWidgetInternal {...props} resolvedSize={size} />
    </ReactorSizeProvider>
  );
};
