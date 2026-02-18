import { ReactorPanelModel } from '../../stores/workspace/react-workspaces/ReactorPanelModel';

export const EMPTY_REACTOR_PANEL_TYPE = 'empty';

export class EmptyReactorPanelModel extends ReactorPanelModel {
  constructor() {
    super(EMPTY_REACTOR_PANEL_TYPE);
    this.setExpand(true, true);
  }
}
