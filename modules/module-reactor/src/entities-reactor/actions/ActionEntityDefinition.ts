import { EntityDefinition } from '../../entities/EntityDefinition';
import { ReactorEntities, ReactorEntityCategories } from '../ReactorEntities';
import { ActionEntityEncoder } from './ActionEntityEncoder';
import { Action, ActionRollbackMechanic } from '../../actions/Action';
import { ParameterizedAction } from '../../actions/parameterized/ParameterizedAction';
import { ActionEntityHandler } from './ActionEntityHandler';
import { EntityPanelComponent } from '../../entities/components/ui/EntityPanelComponent';
import { InlineTreePresenterComponent } from '../../entities/components/presenter/types/tree/InlineTreePresenterComponent';
import { ActionTreePresenter } from './ActionTreePresenter';
import { EntityDescriberComponent, EntityLabel } from '../../entities/components/meta/EntityDescriberComponent';
import { ActionSearchEngineComponent } from './ActionSearchEngineComponent';
import { EntityCardsPresenterComponent } from '../../entities/components/presenter/types/cards/EntityCardsPresenterComponent';
import { TagDisplayMode } from '../../widgets/tree/TreeEntityDisplayMode';

function getActionMetadata(entity: Action): EntityLabel[] {
  const metadata: EntityLabel[] = [
    {
      label: 'Type',
      value: entity.getTypeDisplayName(),
      icon: {
        name: 'cube',
        color: 'currentColor'
      }
    }
  ];
  if (entity.options.exemptFromExclusiveExecutionLock) {
    metadata.push({
      label: 'Execution lock',
      value: 'Exempt'
    });
  }
  if (entity.options.hideFromCmdPallet) {
    metadata.push({
      label: 'Command palette',
      value: 'Hidden'
    });
  }
  return metadata;
}

export class ActionEntityDefinition extends EntityDefinition<Action> {
  constructor() {
    super({
      type: ReactorEntities.ACTION,
      category: ReactorEntityCategories.CORE,
      label: 'Action',
      icon: 'bolt',
      iconColor: 'orange'
    });
    this.registerComponent(
      new EntityDescriberComponent<Action>({
        label: 'Simple',
        describe: (entity: Action) => {
          return {
            icon: entity.options.icon,
            simpleName: entity.options.name,
            labels: getActionMetadata(entity),
            tags: entity.options.tags
          };
        }
      })
    );
    this.registerComponent(
      new EntityDescriberComponent<Action>({
        label: 'Advanced',
        describe: (entity: Action) => {
          const behavior = entity.options.behavior || 'none';
          const rollback = entity.options.rollbackMechanic || ActionRollbackMechanic.NONE;

          return {
            icon: entity.options.icon,
            simpleName: entity.options.name,
            complexName: entity.getTypeDisplayName(),
            iconColor: !(entity instanceof ParameterizedAction) ? 'orange' : 'mediumpurple',
            labels: [
              ...getActionMetadata(entity),
              {
                label: 'Hotkeys',
                value: `${entity.options.hotkeys?.length || 0}`,
                icon: {
                  name: 'keyboard',
                  color: 'currentColor'
                }
              },
              {
                label: 'Validators',
                value: `${entity.options.validators?.length || 0}`,
                icon: {
                  name: 'shield',
                  color: 'currentColor'
                }
              },
              {
                label: 'Behavior',
                value: behavior,
                icon: {
                  name: 'bolt',
                  color: 'currentColor'
                }
              },
              {
                label: 'Rollback',
                value: rollback,
                icon: {
                  name: 'rotate-left',
                  color: 'currentColor'
                }
              }
            ],
            tags: entity.options.tags
          };
        }
      })
    );
    this.registerComponent(new ActionEntityHandler());
    this.registerComponent(new ActionEntityEncoder());
    this.registerComponent(
      new InlineTreePresenterComponent<Action>({
        allowedGroupingSettings: {
          complexName: true,
          tags: true
        },
        tagDisplayMode: TagDisplayMode.PILL
      })
    );
    this.registerComponent(new EntityCardsPresenterComponent<Action>());
    this.registerComponent(new ActionTreePresenter());
    this.registerComponent(
      new EntityPanelComponent<Action>({
        // used to be the actions panel
        legacyType: 'actions',
        label: 'Actions',
        getEntities: () => {
          return this.actionStore.getActions();
        }
      })
    );
    this.registerComponent(new ActionSearchEngineComponent());
  }
  matchEntity(t: any): boolean {
    if (t instanceof Action) {
      return true;
    }
  }

  getEntityUID(t: Action) {
    return t.id;
  }
}
