import * as React from 'react';
import * as _ from 'lodash';
import styled from '@emotion/styled';
import { JOURNEY_MIME } from './DraggableWidget';
import { DropzoneDividerWidget } from './DropzoneDividerWidget';
import { SerializedAction } from '../../actions/Action';
import { SerializedEntity } from '../../providers/Provider';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface DropzoneWidgetProps {
  vertical: boolean;
  className?;
  size?: number;
  dropped?: (entity: SerializedEntity | SerializedAction, index: number) => any;
}

export interface DropzoneWidgetState {
  dragging: boolean;
}

namespace S {
  export const Container = styled.div<{ vertical: boolean }>`
    display: flex;
    flex-direction: ${(p) => (p.vertical ? 'column' : 'row')};
  `;

  export const EmptyPlaceholderV = themed.div<{ size: number }>`
    height: 10px;
    min-width: ${(p) => p.size}px;
  `;
  export const EmptyPlaceholderH = themed.div<{ size: number }>`
    width: 10px;
    min-height: ${(p) => p.size}px;
  `;
}
/**
 * @deprecated
 */
export class DropzoneWidget extends React.Component<React.PropsWithChildren<DropzoneWidgetProps>, DropzoneWidgetState> {
  listener: any;

  constructor(props: DropzoneWidgetProps) {
    super(props);
    this.state = {
      dragging: false
    };
  }

  getContent() {
    const children = React.Children.toArray(this.props.children);
    if (children.length === 0) {
      return (
        <>
          <DropzoneDividerWidget
            vertical={this.props.vertical}
            dropped={(model) => {
              this.props.dropped(model, 0);
            }}
            size={this.props.size}
            key={0}
          />
          {this.props.vertical ? (
            <S.EmptyPlaceholderV size={this.props.size} />
          ) : (
            <S.EmptyPlaceholderH size={this.props.size} />
          )}
        </>
      );
    }

    if (this.state.dragging) {
      return [
        <DropzoneDividerWidget
          vertical={this.props.vertical}
          dropped={(model) => {
            this.props.dropped(model, 0);
          }}
          size={this.props.size}
          key={0}
        />
      ].concat(
        _.map(children, (child, index) => {
          return (
            <React.Fragment>
              {child}
              <DropzoneDividerWidget
                vertical={this.props.vertical}
                dropped={(model) => {
                  this.props.dropped(model, index + 1);
                }}
                size={this.props.size}
              />
            </React.Fragment>
          );
        })
      );
    }
    return this.props.children;
  }

  render() {
    return (
      <S.Container
        vertical={this.props.vertical}
        className={this.props.className}
        onDragOver={(event) => {
          if (this.listener) {
            clearTimeout(this.listener);
          }
          let found = false;
          for (var i = 0; i < event.dataTransfer.types.length; ++i) {
            // allow the effect
            if (event.dataTransfer.types[i] === JOURNEY_MIME) {
              found = true;
            }
          }

          if (!found) {
            return;
          }

          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';

          if (!this.state.dragging) {
            this.setState({
              dragging: true
            });
          }
        }}
        onDrop={() => {
          this.setState({
            dragging: false
          });
        }}
        onDragLeave={() => {
          this.listener = setTimeout(() => {
            this.setState({ dragging: false });
          }, 300);
        }}
      >
        {this.getContent()}
      </S.Container>
    );
  }
}
