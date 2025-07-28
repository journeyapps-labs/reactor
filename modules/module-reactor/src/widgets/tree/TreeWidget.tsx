import * as React from 'react';
import styled from '@emotion/styled';
import { TreeLeafWidget, TreeLeafWidgetCommonProps } from './TreeLeafWidget';
import { observer } from 'mobx-react';
import * as _ from 'lodash';

export interface TreeWidgetProps extends TreeLeafWidgetCommonProps {
  children?: (depth: number) => any;
  openDefault?: boolean;
  openOnSingleClick?: boolean;
  collapsed?: boolean;
  onCollapsedChanged?: (collapsed: boolean, deep: boolean) => any;
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  empty?: boolean;
  hideOpenIcon?: boolean;
  tooltip?: string;
  className?: any;
}

export interface TreeWidgetState {
  open: boolean;
}

@observer
export class TreeWidget extends React.Component<TreeWidgetProps, TreeWidgetState> {
  timer: any;

  constructor(props: TreeWidgetProps) {
    super(props);
    this.state = {
      open: props.openDefault
    };
  }

  getChildren(depth) {
    if (this.props.loading && this.props.empty) {
      return this.getChildMessage(depth, this.props.loadingMessage);
    }
    if (!this.props.children || this.props.empty) {
      return this.getChildMessage(depth, this.props.emptyMessage);
    }
    const children = this.props.children(depth);
    if (React.Children.count(children) === 0) {
      return this.getChildMessage(depth, this.props.emptyMessage);
    }
    return children;
  }

  isCollapsed() {
    if (this.props.collapsed != null) {
      return this.props.collapsed;
    }
    return !this.state.open;
  }

  toggle(collapsed, deep?: boolean) {
    if (this.props.collapsed != null) {
      this.props.onCollapsedChanged?.(collapsed, deep);
    } else {
      this.setState(
        {
          open: !collapsed
        },
        () => {
          this.props.onCollapsedChanged?.(collapsed, deep);
        }
      );
    }
  }

  getChildMessage(depth: number, message: string) {
    if (!message) {
      return null;
    }
    return (
      <S.Empty>
        <TreeLeafWidget label={message} depth={depth} />
      </S.Empty>
    );
  }

  normalClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    this.props.normalClick?.(event);
    if (this.props.openOnSingleClick !== false) {
      this.toggle(!this.isCollapsed());
      return;
    }
    if (this.timer) {
      this.toggle(!this.isCollapsed());
      clearTimeout(this.timer);
      this.timer = null;
      return;
    }
    this.timer = setTimeout(() => {
      this.timer = null;
    }, 200);
  };

  getCollapsedPayload = _.memoize((c: Partial<{ collapsed: boolean; enabled: boolean }>) => {
    return {
      collapsed: c.collapsed,
      enabled: c.enabled,
      changed: (collapsed, deep) => {
        this.toggle(collapsed, deep);
      }
    };
  });

  getLeaf() {
    const depth = this.props.depth || 0;
    const children = this.getChildren(depth);
    return (
      <TreeLeafWidget
        {...this.props}
        icon={this.props.loading ? 'spinner' : (this.props.icon as any)}
        iconSpin={this.props.loading}
        depth={depth}
        normalClick={this.normalClick}
        collapse={
          this.props.hideOpenIcon
            ? null
            : this.getCollapsedPayload({
                collapsed: this.isCollapsed(),
                enabled: React.Children.count(children) > 0
              })
        }
      />
    );
  }

  render() {
    const depth = this.props.depth || 0;
    const children = this.getChildren(depth + 1);
    return (
      <div className={this.props.className}>
        {this.getLeaf()}
        {!this.isCollapsed() ? <S.Children>{children}</S.Children> : null}
      </div>
    );
  }
}

namespace S {
  export const Children = styled.div`
    margin-top: 2px;
  `;

  export const Empty = styled.div`
    opacity: 0.5;
    font-style: italic;
  `;
}
