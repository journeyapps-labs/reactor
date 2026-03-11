import * as React from 'react';
import { ReactorPanelModel } from '../../../stores/workspace/react-workspaces/ReactorPanelModel';

export const WorkspaceModelContext: React.Context<ReactorPanelModel> = React.createContext<ReactorPanelModel>(null);
