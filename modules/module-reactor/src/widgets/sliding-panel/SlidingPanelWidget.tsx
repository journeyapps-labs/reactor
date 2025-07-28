import * as React from 'react';
import styled from '@emotion/styled';
import Slider from 'react-slick';
import * as _ from 'lodash';

import 'slick-carousel/slick/slick.css';

export interface SlidingPanelDirective {
  key: string;
  getContent: () => React.JSX.Element;
}

export interface SlidingPanelWidgetProps {
  panels: SlidingPanelDirective[];
  selected: string;
  width: number;
  forwardRef?: React.RefObject<HTMLDivElement>;
}

export interface SlidingPanelWidgetState {}

namespace S {
  export const Container = styled.div<{ width: number }>`
    overflow: hidden;
    * {
      outline: none !important;
    }
  `;
}

export class SlidingPanelWidget extends React.Component<SlidingPanelWidgetProps, SlidingPanelWidgetState> {
  ref: React.RefObject<Slider>;

  constructor(props: SlidingPanelWidgetProps) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidUpdate(
    prevProps: Readonly<SlidingPanelWidgetProps>,
    prevState: Readonly<SlidingPanelWidgetState>,
    snapshot?: any
  ): void {
    if (prevProps.selected !== this.props.selected) {
      const index = _.findIndex(this.props.panels, { key: this.props.selected });
      setTimeout(() => {
        this.ref.current.slickGoTo(index, 1000);
      }, 100);
    }
  }

  render() {
    return (
      <S.Container ref={this.props.forwardRef} width={this.props.width}>
        <Slider
          ref={this.ref}
          {...{
            dots: false,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: false,
            accessibility: false,
            arrows: false,
            draggable: false,
            speed: 500
          }}
        >
          {_.map(this.props.panels, (panel) => {
            return <div key={panel.key}>{panel.getContent()}</div>;
          })}
        </Slider>
      </S.Container>
    );
  }
}
