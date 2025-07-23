import * as React from 'react';
import styled from '@emotion/styled';
import { Action } from '../../actions/Action';
import { SerializedEntity } from '../../providers/Provider';

export interface DraggableWidgetProps {
  entity?: SerializedEntity;
  action?: Action;
  className?;
  forwardRef?: React.RefObject<HTMLElement>;
  dragging?: (draggin: boolean) => any;
}

export interface DraggableWidgetState {}

namespace S {
  export const Container = styled.div``;
}

export const JOURNEY_MIME = 'journey/serializable';
/**
 * @deprecated
 */
export class DraggableWidget extends React.Component<
  React.PropsWithChildren<DraggableWidgetProps>,
  DraggableWidgetState
> {
  ref: React.RefObject<HTMLDivElement>;

  constructor(props: DraggableWidgetProps) {
    super(props);
    this.state = {};
    this.ref = React.createRef();
  }

  serialize() {
    if (this.props.entity) {
      return JSON.stringify(this.props.entity);
    }
    return JSON.stringify(this.props.action.serialize());
  }

  async componentDidMount() {
    (this.props.forwardRef || this.ref).current.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData(JOURNEY_MIME, this.serialize());
      if (this.props.dragging) {
        this.props.dragging(true);
      }
    });

    (this.props.forwardRef || this.ref).current.addEventListener('dragend', (event) => {
      if (this.props.dragging) {
        this.props.dragging(false);
      }
    });
  }

  render() {
    if (this.props.forwardRef) {
      return this.props.children;
    }
    return (
      <S.Container ref={this.ref} className={this.props.className} draggable={true}>
        {this.props.children}
      </S.Container>
    );
  }
}
