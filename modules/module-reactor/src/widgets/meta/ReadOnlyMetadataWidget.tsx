import * as React from 'react';
import styled from '@emotion/styled';
import { MetadataWidget, MetadataWidgetProps } from './MetadataWidget';
import { useCopyButton } from '../../hooks/useCopyButton';
import { setupTooltipProps } from '../info/tooltips';

export interface ReadOnlyMetadataWidgetProps extends MetadataWidgetProps {
  showIcon?: boolean;
}

export const ReadOnlyMetadataWidget: React.FC<ReadOnlyMetadataWidgetProps> = (props) => {
  const data = useCopyButton({
    value: props.value
  });

  let icon = props.icon || {
    name: 'clipboard',
    color: 'currentColor'
  };

  return (
    <S.Container className={props.className} {...setupTooltipProps(data)}>
      <MetadataWidget
        {...props}
        className={null}
        icon={(props.showIcon ?? true) ? icon : null}
        onClick={(event) => {
          data.action(event);
        }}
      />
    </S.Container>
  );
};
namespace S {
  export const Container = styled.div``;
}
