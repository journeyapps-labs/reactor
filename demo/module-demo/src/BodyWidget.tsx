import * as React from 'react';
import styled from '@emotion/styled';
import { BodyWidget } from '@journeyapps-labs/reactor-mod';

export interface DemoBodyWidgetProps {}

export const DemoBodyWidget: React.FC<DemoBodyWidgetProps> = (props) => {
  return <BodyWidget logo={'#'} logoClicked={(event) => {}} />;
};

namespace S {
  export const Container = styled.div``;
}
