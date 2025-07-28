import * as React from 'react';
import * as _ from 'lodash';
import styled from '@emotion/styled';
import { ImageMedia, ImageMediaURL } from './ImageMedia';
import { LoadingPanelWidget } from '../../../widgets/panel/panel/LoadingPanelWidget';
import { PanelToolbarWidget } from '../../../widgets/panel/toolbar/PanelToolbarWidget';

export interface ImageMediaPanelWidgetProps {
  asset: ImageMedia;
}

export interface ImageMediaPanelWidgetState {
  handler: ImageMediaURL;
  width: number;
  height: number;
  scale: number;
}

namespace S {
  export const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    position: absolute;
  `;

  export const Viewer = styled.div`
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    justify-content: center;
    align-items: center;
  `;

  export const Image = styled.img<{ scale: number }>`
    transform: scale(${(p) => p.scale});
  `;
}

export class ImageMediaPanelWidget extends React.Component<ImageMediaPanelWidgetProps, ImageMediaPanelWidgetState> {
  forwardRef: React.RefObject<HTMLImageElement>;
  containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: ImageMediaPanelWidgetProps) {
    super(props);
    this.state = {
      handler: null,
      width: null,
      height: null,
      scale: 1
    };
    this.forwardRef = React.createRef();
    this.containerRef = React.createRef();
  }

  async componentDidMount() {
    const url = await this.props.asset.getImageURL();
    this.setState({
      handler: url
    });
  }

  componentWillUnmount(): void {
    if (this.state.handler) {
      // release URL memory
      this.state.handler.dispose();
    }
  }

  componentDidUpdate(
    prevProps: Readonly<ImageMediaPanelWidgetProps>,
    prevState: Readonly<ImageMediaPanelWidgetState>,
    snapshot?: any
  ) {
    // size has not been computed yet, compute it so we can
    // figure out how we need to scale it
    if (this.forwardRef.current && this.state.width === null) {
      _.defer(() => {
        const width = this.forwardRef.current.naturalWidth;
        const height = this.forwardRef.current.naturalHeight;

        const containerWidth = this.containerRef.current.offsetWidth;
        const containerHeight = this.containerRef.current.offsetHeight;

        // handle oversize
        let scale = 1;
        if (height > containerHeight) {
          scale = containerHeight / height;
        }
        if (width > containerWidth) {
          const scale2 = containerWidth / width;
          scale = Math.min(scale, scale2);
        }

        this.setState({
          width: width,
          height: height,
          scale: scale
        });
      });
    }
  }

  render() {
    return (
      <LoadingPanelWidget
        loading={!this.state.handler}
        children={() => {
          return (
            <S.Container>
              <PanelToolbarWidget
                meta={[
                  {
                    label: 'Name',
                    value: this.props.asset.getOptions().name
                  },
                  {
                    label: 'Current Scale',
                    value: `${this.state.scale * 100}%`
                  },
                  {
                    label: 'Type',
                    value: `${this.props.asset.getOptions().type.options.displayName} (${
                      this.props.asset.getOptions().type.options.mime
                    })`
                  },
                  {
                    label: 'Width',
                    value: `${this.state.width}px`
                  },
                  {
                    label: 'Height',
                    value: `${this.state.height}px`
                  },
                  {
                    label: 'Size',
                    value: `${this.props.asset.getMB()} mb`
                  }
                ]}
              />
              <S.Viewer ref={this.containerRef}>
                <S.Image scale={this.state.scale} src={this.state.handler.url} ref={this.forwardRef} />
              </S.Viewer>
            </S.Container>
          );
        }}
      />
    );
  }
}
