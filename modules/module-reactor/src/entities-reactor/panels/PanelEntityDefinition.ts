import { EntityDefinition } from '../../entities/EntityDefinition';
import { ReactorEntities, ReactorEntityCategories } from '../ReactorEntities';
import { EntityPanelComponent } from '../../entities/components/ui/EntityPanelComponent';
import { InlineTreePresenterComponent } from '../../entities/components/presenter/types/tree/InlineTreePresenterComponent';
import { EntityDescriberComponent } from '../../entities/components/meta/EntityDescriberComponent';
import { ReactorPanelFactory } from '../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { inject } from '../../inversify.config';
import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { SimpleEntitySearchEngineComponent } from '../../entities/components/search/SimpleEntitySearchEngineComponent';
import { AddPanelWorkspaceAction } from '../../actions/builtin-actions/workspace/AddPanelWorkspaceAction';
import { EntityActionHandlerComponent } from '../../entities/components/handler/EntityActionHandlerComponent';
import { PassiveActionValidationState } from '../../actions/validators/ActionValidator';
import { EntityTreeGroupingSetting } from '../../entities/components/presenter/types/tree/EntityTreePresenterComponent';

export class PanelEntityDefinition extends EntityDefinition<ReactorPanelFactory> {
  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  constructor() {
    super({
      type: ReactorEntities.PANEL,
      category: ReactorEntityCategories.CORE,
      label: 'Panels',
      icon: 'industry',
      iconColor: 'cyan'
    });
    this.registerComponent(
      new EntityDescriberComponent<ReactorPanelFactory>({
        label: 'Simple',
        describe: (entity: ReactorPanelFactory) => {
          return {
            icon: entity.options.icon,
            iconColor: entity.options.color,
            simpleName: entity.options.name,
            tags: [entity.options.category]
          };
        }
      })
    );
    this.registerComponent(
      new SimpleEntitySearchEngineComponent<ReactorPanelFactory>({
        label: 'Default',
        getEntities: async () => {
          return this.workspaceStore.getPanelFactories().filter((f) => f.options.allowManualCreation !== false);
        }
      })
    );
    this.registerComponent(new EntityActionHandlerComponent(AddPanelWorkspaceAction.ID));
    this.registerComponent(
      new InlineTreePresenterComponent<ReactorPanelFactory>({
        allowedGroupingSettings: {
          tags: true
        },
        defaultGroupingSetting: EntityTreeGroupingSetting.TAGS,
        augmentTreeProps: (entity) => {
          const hasBlockingValidation = (entity.options.validators || []).some((validator) => {
            const validation = validator.validate();
            return (
              validation.type === PassiveActionValidationState.DISABLED ||
              validation.type === PassiveActionValidationState.DISALLOWED
            );
          });
          const selectable = entity.options.allowManualCreation !== false && !hasBlockingValidation;

          return {
            deactivated: !selectable,
            label2: !selectable ? 'unavailable' : null
          };
        }
      })
    );
    this.registerComponent(
      new EntityPanelComponent<ReactorPanelFactory>({
        getEntities: () => {
          return this.workspaceStore.getPanelFactories();
        }
      })
    );
  }
  matchEntity(t: any): boolean {
    if (t instanceof ReactorPanelFactory) {
      return true;
    }
  }

  getEntityUID(t: ReactorPanelFactory) {
    return t.options.type;
  }
}
