import * as React from 'react';
import * as _ from 'lodash';
import styled from '@emotion/styled';
import { Btn } from '../../definitions/common';
import { TreeWidget, TreeWidgetProps } from '../tree/TreeWidget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { TreeContentWidget } from '../tree/TreeContentWidget';
import { MetadataWidget, MetadataWidgetProps } from '../meta/MetadataWidget';
import { TreeLeafWidget } from '../tree/TreeLeafWidget';
import { IconWidget, ReactorIcon } from '../icons/IconWidget';
import { getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';

export enum StatusCardState {
  LOADING = 'loading',
  COMPLETE = 'complete',
  FAILED = 'failed',
  WAITING = 'waiting',
  NA = 'na'
}

export interface StatusCardWidgetProps {
  label: TreeWidgetProps;
  status?: StatusCardState;
  meta?: MetadataWidgetProps[];
  btns?: Btn[];
  children?: () => React.JSX.Element;
  className?;
  showStatusIcon?: boolean;
}

namespace S {
  const PADDING = 5;

  export const Container = themed.div`
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    background: ${(p) => p.theme.status.cardBackground};
    border: solid 1px ${(p) => getTransparentColor(p.theme.cards.border, 0.5)};
    width: 100%;
  `;

  export const Status = themed.div<{ status: StatusCardState; showIcon: boolean }>`
    padding: ${PADDING}px;
    font-size: 15px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: ${(p) =>
      ({
        [StatusCardState.COMPLETE]: p.theme.status.success,
        [StatusCardState.FAILED]: p.theme.status.failed,
        [StatusCardState.LOADING]: p.theme.status.loading
      })[p.status]};
    min-width: ${(p) => (p.showIcon ? 40 : 10)}px;
  `;

  export const Content = styled.div`
    padding: ${PADDING}px;
    flex-grow: 1;
    width: 100%;
  `;

  export const TreeContent = styled(TreeContentWidget)`
    padding-top: 5px;
    flex-wrap: wrap;
    flex-shrink: 1;
  `;

  export const Metadatas = styled.div`
    display: flex;
    flex-shrink: 1;
    align-items: center;
    margin-left: 20px;
    flex-wrap: wrap;
    column-gap: 5px;
    row-gap: 5px;
  `;

  export const Label = styled.div`
    display: flex;
    align-items: center;
  `;

  export const TreeLeaf = styled(TreeLeafWidget)`
    flex-shrink: 1;
  `;
}

export class StatusCardWidget extends React.Component<StatusCardWidgetProps> {
  getIcon(): ReactorIcon {
    if (this.props.status === StatusCardState.COMPLETE) {
      return 'check';
    }
    if (this.props.status === StatusCardState.FAILED) {
      return 'times';
    }
    if (this.props.status === StatusCardState.WAITING) {
      return 'hourglass-start';
    }
    return 'spinner';
  }

  getMetaData() {
    if (_.size(this.props.meta || {}) == 0) {
      return null;
    }
    return (
      <S.Metadatas>
        {_.map(this.props.meta, (meta) => {
          return <MetadataWidget {...meta} key={meta.label} />;
        })}
      </S.Metadatas>
    );
  }

  getStatus() {
    if (!this.props.status || this.props.status === StatusCardState.NA) {
      return null;
    }
    const showIcon = this.props.showStatusIcon ?? true;
    return (
      <S.Status showIcon={showIcon} status={this.props.status}>
        {showIcon ? <IconWidget icon={this.getIcon()} spin={this.props.status === StatusCardState.LOADING} /> : null}
      </S.Status>
    );
  }

  getChildren() {
    if (!this.props.children) {
      return (
        <TreeLeafWidget
          {...this.props.label}
          label={this.props.label.label}
          rightChildrenWrap={true}
          rightChildren={this.getMetaData()}
        />
      );
    }
    return (
      <TreeWidget
        {...this.props.label}
        label={this.props.label.label}
        rightChildrenWrap={true}
        rightChildren={this.getMetaData()}
      >
        {(depth) => {
          return <S.TreeContent depth={depth}>{this.props.children()}</S.TreeContent>;
        }}
      </TreeWidget>
    );
  }

  render() {
    return (
      <S.Container className={this.props.className}>
        {this.getStatus()}
        <S.Content>{this.getChildren()}</S.Content>
      </S.Container>
    );
  }
}
