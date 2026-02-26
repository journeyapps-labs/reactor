import * as React from 'react';
import { BodyWidget } from '@journeyapps-labs/reactor-mod';

export interface DemoBodyWidgetProps {}

export const DemoBodyWidget: React.FC<DemoBodyWidgetProps> = () => {
  return <BodyWidget logo={'#'} logoClicked={() => {}} />;
};
