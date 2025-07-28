import React from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';

import { InputContainerWidget } from './InputContainerWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export type FormWarningRecord = Record<string, string[]>;
export type FormErrorRecord = FormWarningRecord;

export interface FormErrorDisplayProps {
  errors: string[];
  warnings: string[];
}

export const FormErrorDisplayWidget: React.FC<FormErrorDisplayProps> = (props) => {
  const result = [];

  const { errors, warnings } = props;

  if (!_.isEmpty(errors)) {
    result.push(
      <InputContainerWidget label="Errors" key="errors">
        <S.ErrorList key="errors">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </S.ErrorList>
      </InputContainerWidget>
    );
  }

  if (!_.isEmpty(warnings)) {
    result.push(
      <InputContainerWidget label="Warnings" key="warnings">
        <S.WarningsList>
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </S.WarningsList>
      </InputContainerWidget>
    );
  }

  return <S.Container>{result}</S.Container>;
};

namespace S {
  export const Container = styled.div`
    padding: 10px;
  `;

  export const ErrorList = themed.ul`
  font-size: 12px;
  color: ${(p) => p.theme.status.failed}
`;

  export const WarningsList = themed.ul`
  font-size: 12px;
  color: ${(p) => p.theme.status.loading}
`;
}
