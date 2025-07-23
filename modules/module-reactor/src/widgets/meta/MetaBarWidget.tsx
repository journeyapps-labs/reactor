import * as React from 'react';
import styled from '@emotion/styled';
import { ReadOnlyMetadataWidget, ReadOnlyMetadataWidgetProps } from './ReadOnlyMetadataWidget';

export interface MetaBarWidgetProps {
  meta?: ReadOnlyMetadataWidgetProps[];
  showIcons?: boolean;
  className?: any;
}

export const MetaBarWidget: React.FC<MetaBarWidgetProps> = (props) => {
  return (
    <S.Container className={props.className}>
      {(props.meta || [])
        .filter((f) => !!f)
        .map((value) => {
          return <S.PanelToolbarMeta showIcon={props.showIcons} {...value} key={value.label} />;
        })}
    </S.Container>
  );
};
namespace S {
  export const PanelToolbarMeta = styled(ReadOnlyMetadataWidget)``;

  export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: 5px;
    row-gap: 5px;
  `;
}
