import * as React from 'react';
import styled from '@emotion/styled';
import { PanelButtonWidget } from '../../forms/PanelButtonWidget';
import { themed } from '../../../stores/themes/reactor-theme-fragment';

const aw_snap = require('../../../../media/panel-error.svg');

export const AwSnapWidget: React.FC = () => {
  return (
    <S.Error>
      <S.Image src={aw_snap} />
      <S.ErrorTitle>Oh no!</S.ErrorTitle>
      <S.ErrorMessage>Something went wrong</S.ErrorMessage>
      <PanelButtonWidget
        label="Reload"
        action={() => {
          window.location.reload();
        }}
      />
    </S.Error>
  );
};

namespace S {
  export const Image = styled.img`
    width: 80px;
    margin-bottom: 10px;
  `;

  export const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
  `;

  export const Error = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    min-width: 250px;
    width: 100%;
    height: 100%;
  `;

  export const ErrorTitle = themed.div`
    color: ${(p) => p.theme.text.primary};
    max-width: 140px;
    font-size: 16px;
    text-align: center;
    margin-bottom: 10px;
  `;

  export const ErrorMessage = themed.div`
    color: ${(p) => p.theme.text.secondary};
    max-width: 200px;
    font-size: 16px;
    text-align: center;
    margin-bottom: 15px;
  `;
}
