import { EntityDefinition } from '../../entities/EntityDefinition';
import { ReactorEntities, ReactorEntityCategories } from '../ReactorEntities';
import { IDEWorkspace, WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { EntityDescriberComponent } from '../../entities/components/meta/EntityDescriberComponent';
import { InlineEntityEncoderComponent } from '../../entities/components/encoder/InlineEntityEncoderComponent';
import { SimpleEntitySearchEngineComponent } from '../../entities/components/search/SimpleEntitySearchEngineComponent';
import { EntityActionHandlerComponent } from '../../entities/components/handler/EntityActionHandlerComponent';
import { SwitchWorkspaceAction } from '../../actions/builtin-actions/SwitchWorkspaceAction';
import { ReactorRootWorkspaceModel } from '../../stores/workspace/react-workspaces/ReactorRootWorkspaceModel';
import { inject } from '../../inversify.config';

interface EncodedWorkspace {
  id: string;
}

export class WorkspaceEntityDefinition extends EntityDefinition<IDEWorkspace> {
  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  constructor() {
    super({
      type: ReactorEntities.WORKSPACE,
      category: ReactorEntityCategories.CORE,
      label: 'Workspaces',
      icon: 'th-large',
      iconColor: 'cyan'
    });

    this.registerComponent(
      new EntityDescriberComponent<IDEWorkspace>({
        label: 'Simple',
        describe: (entity: IDEWorkspace) => {
          return {
            simpleName: entity.name
          };
        }
      })
    );

    this.registerComponent(
      new InlineEntityEncoderComponent<IDEWorkspace, EncodedWorkspace>({
        version: 1,
        encode: (entity) => {
          return { id: entity.model.id };
        },
        decode: async (entity) => {
          return this.workspaceStore.getIDEWorkspace(entity.id);
        }
      })
    );

    this.registerComponent(
      new SimpleEntitySearchEngineComponent<IDEWorkspace>({
        label: 'Workspaces',
        getEntities: async () => {
          return this.workspaceStore.workspaces;
        }
      })
    );

    this.registerComponent(new EntityActionHandlerComponent(SwitchWorkspaceAction.ID));
  }

  getEntityUID(entity: IDEWorkspace): string {
    return entity.model.id;
  }

  matchEntity(entity: any): boolean {
    return !!entity && typeof entity.name === 'string' && entity.model instanceof ReactorRootWorkspaceModel;
  }
}
