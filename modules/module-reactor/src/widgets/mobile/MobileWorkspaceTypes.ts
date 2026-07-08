import { ReactorPanelFactory } from '../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../../stores/workspace/react-workspaces/ReactorPanelModel';
import { ReactorTabFactoryModel } from '../../stores/workspace/react-workspaces/ReactorTabFactory';

export interface MobilePanelScreen {
  type: 'panel';
  id: string;
  title: string;
  model: ReactorPanelModel;
  factory: ReactorPanelFactory;
}

export interface MobileTabScreen {
  type: 'tabs';
  id: string;
  title: string;
  model: ReactorTabFactoryModel;
  panels: MobilePanelScreen[];
}

export type MobileScreen = MobilePanelScreen | MobileTabScreen;
