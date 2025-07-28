import * as React from 'react';
import styled from '@emotion/styled';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface FloatingInspectorSectionWidgetProps {
  name: string;
  inline?: boolean;
}

namespace S {
  export const Container = themed.div<{ inline: boolean }>`
      padding: 15px;
      display: flex;
      flex-direction: ${(p) => (p.inline ? 'row' : 'column')};
      border-bottom: solid 1px ${(p) => p.theme.combobox.headerBackground};
      flex-shrink: 0;
  `;

  export const Name = themed.div<{ inline: boolean }>`
      font-weight: 600;
      flex-grow: 1;
      color: ${(p) => p.theme.combobox.text};
      margin-bottom: ${(p) => (p.inline ? 0 : 14)}px;
  `;

  export const Content = styled.div<{ inline: boolean }>`
    margin-left: ${(p) => (p.inline ? 14 : 0)}px;
  `;
}

export class FloatingInspectorSectionWidget extends React.Component<
  React.PropsWithChildren<FloatingInspectorSectionWidgetProps>
> {
  render() {
    return (
      <S.Container inline={this.props.inline}>
        {this.props.name ? <S.Name inline={this.props.inline}>{this.props.name}</S.Name> : null}
        <S.Content inline={this.props.inline}>{this.props.children}</S.Content>
      </S.Container>
    );
  }
}
