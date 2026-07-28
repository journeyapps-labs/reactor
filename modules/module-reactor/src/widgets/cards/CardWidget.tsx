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
import { size, getReactorBorderRadius, ReactorSizeProvider, Size, useReactorSize } from '../../hooks/useReactorSize';
import { REACTOR_MOBILE_MEDIA_QUERY } from '../../hooks/useReactorViewportMode';

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
    border-bottom-left-radius: ${(p) => size(p, [5, 8, 10])}px;
    border-bottom-right-radius: ${(p) => size(p, [5, 8, 10])}px;
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
    padding: ${(p) => size(p, ['10px', '12px', '16px'])};
  `;

  export const Info = styled.div`
    flex-grow: 1;
  `;

  export const Title = themed.div<{ $size: Size }>`
    font-size: ${(p) => size(p, ['14px', '16px', '18px'])};
    font-weight: bold;
    color: ${(p) => p.theme.cards.foreground};
  `;

  export const Subtitle = themed.div<{ color?: string; $size: Size }>`
    font-size: ${(p) => size(p, ['12px', '13px', '15px'])};
    color: ${(p) => p.color || p.theme.cards.foreground};
  `;

  export const Content = themed.div<{ grow: boolean; $size: Size }>`
    flex-grow: ${(p) => (p.grow ? 1 : 0)};
    border-top: solid 1px;
    border-color: inherit;
    padding: ${(p) => size(p, ['10px', '12px', '16px'])};
    min-width: 0;
    overflow-x: auto;
    ${(p) => getScrollableCSS(p.theme)};
  `;

  export const Buttons = styled.div<{ $visible: boolean }>`
    display: flex;
    align-items: center;
    opacity: ${(p) => (p.$visible ? 1 : 0)};
    pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
    transition: opacity 0.15s ease-out;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      opacity: 1;
      pointer-events: auto;
    }
  `;

  export const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
  `;

  export const Button = themed(PanelButtonWidget)`
    margin-left: 5px;
  `;
}

class CardWidgetInternal extends React.Component<CardWidgetProps & { resolvedSize: Size }> {
  state = {
    hovered: false
  };

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
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        <S.Top $size={this.props.resolvedSize}>
          <S.Info>
            {this.getTitle()}
            {this.getSubHeading()}
          </S.Info>
          <S.Buttons $visible={this.state.hovered}>
            {this.props.btns?.map((btn, index) => {
              return (
                <S.ButtonWrapper key={btn.label || `${index}`} onClick={(event) => event.stopPropagation()}>
                  <S.Button {...btn} />
                </S.ButtonWrapper>
              );
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
