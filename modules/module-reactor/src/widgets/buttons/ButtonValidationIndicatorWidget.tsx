import * as React from 'react';
import styled from '@emotion/styled';
import { ActionValidationState, ValidationResult } from '../../actions/validators/ActionValidator';
import { TreeBadgeWidget } from '../tree/TreeBadgeWidget';

namespace S {
  export const Container = styled.span`
    position: absolute;
    right: -7px;
    top: -7px;
    z-index: 1;
    pointer-events: none;
  `;
}

export interface ButtonValidationIndicatorWidgetProps {
  validationResult: ValidationResult;
}

export const ButtonValidationIndicatorWidget: React.FC<ButtonValidationIndicatorWidgetProps> = (props) => {
  if (props.validationResult.type !== ActionValidationState.BLOCKED || !props.validationResult.indicator) {
    return null;
  }

  return (
    <S.Container aria-hidden>
      <TreeBadgeWidget {...props.validationResult.indicator} />
    </S.Container>
  );
};
