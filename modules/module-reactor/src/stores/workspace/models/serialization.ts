import { SerializedWorkspaceGroup } from './WorkspaceGroup';
import { SerializedWorkspaceModel } from './WorkspaceModel';

export type SerializedWorkspaceEntry = SerializedWorkspaceModel | SerializedWorkspaceGroup;

export interface WorkspacePrefsSerialized {
  type: 'workspaces';
  version?: 1 | 2 | 3;
  models: SerializedWorkspaceEntry[];
  current: string;
  currentTop?: string;
}

export interface ExportedWorkspace extends WorkspacePrefsSerialized {
  replace: boolean;
}

export const isSerializedWorkspaceGroup = (model: SerializedWorkspaceEntry): model is SerializedWorkspaceGroup => {
  return !!model && Array.isArray((model as SerializedWorkspaceGroup).children);
};
