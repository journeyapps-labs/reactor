import * as React from 'react';
import { MouseEvent } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconWidget, ReactorIcon } from '../icons/IconWidget';
import { DualIconWidget } from '../icons/DualIconWidget';
import { observer } from 'mobx-react';
import { TreeContentWidget } from './TreeContentWidget';
import { SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';
import { MatchesWidget } from '../search/MatchesWidget';
import { AttentionWrapperWidget } from '../guide/AttentionWrapperWidget';
import { ButtonComponentSelection, ReactorComponentType } from '../../stores/guide/selections/common';
import { getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface TreeLeafWidgetCommonProps {
  rightChildren?: React.JSX.Element;
  rightChildrenWrap?: boolean;
  rightClick?: (event: MouseEvent) => any;
  normalClick?: (event: MouseEvent) => any;
  mouseOver?: (event: MouseEvent, hover: boolean) => any;
  dropZoneHint?: boolean;
  dropZoneHover?: boolean;
  depth?: number;
  label: string;
  label2?: string;
  tooltip?: string;
  labelColor?: string;
  icon?: ReactorIcon;
  icon2?: ReactorIcon;
  iconSpin?: boolean;
  iconColor?: string;
  icon2Color?: string;
  selected?: boolean;
  deactivated?: boolean;
  forwardRef?: React.RefObject<HTMLDivElement>;
  wrap?: boolean;
  matches?: SearchEventMatch;
}

export interface TreeLeafWidgetProps extends TreeLeafWidgetCommonProps {
  collapse?: {
    collapsed: boolean;
    changed: (collapsed: boolean, deep?: boolean) => any;
    enabled?: boolean;
  };
}

namespace S {
  export const Top = themed.div<{
    selected: boolean;
    deactivated: boolean;
    attention: boolean;
    dropzoneHint: boolean;
    dropzoneHover: boolean;
  }>`

    display: flex;
    align-items: center;
    user-select: none;
    cursor: pointer;
    border: solid 1px transparent;
    background: ${(p) => (p.selected ? p.theme.trees.selectedBackground : 'transparent')};
    border-radius: 5px;
    margin-bottom: 1px;
    color: ${(p) => (p.selected ? p.theme.trees.labelColor : getTransparentColor(p.theme.trees.labelColor, 0.5))};
    opacity: ${(p) => (p.deactivated ? 0.3 : 1)};

    ${(p) => (p.attention ? `border-color: ${p.theme.guide.accent};` : ``)};
    ${(p) => (p.dropzoneHint ? `border-color: ${p.theme.dnd.hintColor};` : '')}
    ${(p) => (p.dropzoneHover ? `background: ${p.theme.dnd.hoverColor};` : '')};

    &:hover {
      color: ${(p) => p.theme.trees.labelColor};
    }
  `;

  export const Title = styled.div<{ selected: boolean; $wrap: boolean; color: string }>`
    font-size: 15px;
    user-select: none;
    ${(p) => (p.$wrap ? '' : 'white-space: nowrap')};
    margin-top: -1px;
    display: flex;
    align-items: center;
    padding-right: 10px;
    ${(p) => (p.color ? `color: ${p.color}` : '')};
  `;

  export const Label2 = styled.div`
    opacity: 0.5;
    margin-left: 5px;
    white-space: nowrap;
  `;

  export const RightContent = styled.div<{ $wrap: boolean }>`
    display: flex;
    align-items: center;
    flex-shrink: ${(p) => (p.$wrap ? 1 : 0)};
    ${(p) => (p.$wrap ? 'flex-wrap: wrap' : '')};
  `;

  export const Icon = styled.div<{ deactivated?: boolean }>`
    margin-right: 6px;
    font-size: 12px;
    min-width: 14px;
    text-align: center;
    align-items: center;
    display: flex;
    opacity: ${(p) => (p.deactivated == null ? 1 : p.deactivated ? 0.1 : 0.2)};
  `;

  export const NestedIcon = styled(IconWidget)`
    max-height: 13px;
  `;

  export const Arrow = themed(FontAwesomeIcon)<{ open: boolean }>`
    color: ${(p) => p.theme.trees.labelColor};
    font-size: 11px;

    transition: transform 0.2s;
    width: 14px;
    text-align: center;

    ${(p) => (p.open ? `transform: rotateZ(90deg);` : '')}
    &:hover {
      opacity: 1;
    }
  `;
}

@observer
export class TreeLeafWidget extends React.Component<TreeLeafWidgetProps> {
  ref: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  getNormalIcon() {
    if (!this.props.icon) {
      return null;
    }

    if (this.props.icon2) {
      return (
        <S.Icon>
          <DualIconWidget
            icon1={this.props.icon}
            icon2={this.props.icon2}
            color1={this.props.iconColor}
            color2={this.props.icon2Color}
          />
        </S.Icon>
      );
    }

    return (
      <S.Icon style={{ color: this.props.iconColor }}>
        <S.NestedIcon icon={this.props.icon as any} spin={this.props.iconSpin} />
      </S.Icon>
    );
  }

  getPlayIcon() {
    if (!this.props.collapse) {
      return null;
    }
    return (
      <S.Icon
        deactivated={!this.props.collapse.enabled}
        onClick={(event) => {
          event.stopPropagation();
          event.persist();
          this.props.collapse.changed(!this.props.collapse.collapsed, event.altKey);
        }}
      >
        <S.Arrow open={!this.props.collapse.collapsed} icon="play" />
      </S.Icon>
    );
  }

  getRightContent() {
    if (this.props.rightChildren) {
      return <S.RightContent $wrap={this.props.rightChildrenWrap}>{this.props.rightChildren}</S.RightContent>;
    }
    return null;
  }

  getTitle() {
    if (!this.props.label) {
      return null;
    }
    if (!this.props.matches) {
      return this.props.label;
    }
    return <MatchesWidget locators={this.props.matches.locators} text={this.props.label as string} />;
  }

  getMainContent(selected: boolean, depth, ref: React.RefObject<any>) {
    return (
      <S.Top
        title={this.props.tooltip}
        dropzoneHover={this.props.dropZoneHover}
        dropzoneHint={this.props.dropZoneHint}
        attention={selected}
        deactivated={this.props.deactivated}
        onClick={(event) => {
          if (this.props.normalClick) {
            event.stopPropagation();
            this.props.normalClick(event);
          }
        }}
        onContextMenu={(event) => {
          if (this.props.rightClick) {
            event.preventDefault();
            event.stopPropagation();
            this.props.rightClick(event);
          }
        }}
        onMouseEnter={(event) => {
          this.props.mouseOver?.(event, true);
        }}
        onMouseLeave={(event) => {
          this.props.mouseOver?.(event, false);
        }}
        ref={ref}
        selected={this.props.selected}
      >
        <TreeContentWidget depth={depth}>
          {this.getPlayIcon()}
          {this.getNormalIcon()}
          <S.Title color={this.props.labelColor} $wrap={this.props.wrap} selected={this.props.selected}>
            {this.getTitle()}
            {this.props.label2 ? <S.Label2>{this.props.label2}</S.Label2> : null}
          </S.Title>
        </TreeContentWidget>
        {this.getRightContent()}
      </S.Top>
    );
  }

  render() {
    let depth = this.props.depth || 0;
    if (!this.props.collapse) {
      depth++;
    }
    const ref = this.props.forwardRef || this.ref;
    return (
      <AttentionWrapperWidget<ButtonComponentSelection>
        forwardRef={ref}
        selection={{
          label: this.props.label
        }}
        type={ReactorComponentType.TREE_LEAF}
        activated={(selected) => {
          return this.getMainContent(!!selected, depth, ref);
        }}
      />
    );
  }
}
