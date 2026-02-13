import { EntityDefinition } from '../../entities/EntityDefinition';
import { ReactorEntities, ReactorEntityCategories } from '../ReactorEntities';
import { ActionEntityEncoder } from './ActionEntityEncoder';
import { Action, ActionRollbackMechanic, ParameterizedAction } from '../../actions';
import { ActionEntityHandler } from './ActionEntityHandler';
import { EntityPanelComponent } from '../../entities/components/ui/EntityPanelComponent';
import { InlineTreePresenterComponent } from '../../entities/components/presenter/types/tree/InlineTreePresenterComponent';
import { ActionTreePresenter } from './ActionTreePresenter';
import { EntityDescriberComponent } from '../../entities/components/meta/EntityDescriberComponent';
import { ActionSearchEngineComponent } from './ActionSearchEngineComponent';
import { EntityCardsPresenterComponent } from '../../entities/components/presenter/types/cards/EntityCardsPresenterComponent';

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
          const tags = [entity instanceof ParameterizedAction ? 'parameterized' : 'standard'];
          if (entity.options.exemptFromExclusiveExecutionLock) {
            tags.push('exclusive-exempt');
          }
          if (entity.options.hideFromCmdPallet) {
            tags.push('cmd-hidden');
          }

          return {
            icon: entity.options.icon,
            simpleName: entity.options.name,
            labels: [
              {
                label: 'Type',
                value: entity.getTypeDisplayName(),
                icon: {
                  name: 'cube',
                  color: 'rgba(255,255,255,0.5)'
                }
              }
            ],
            tags
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
          const tags = [entity instanceof ParameterizedAction ? 'parameterized' : 'standard'];
          if (entity.options.exemptFromExclusiveExecutionLock) {
            tags.push('exclusive-exempt');
          }
          if (entity.options.hideFromCmdPallet) {
            tags.push('cmd-hidden');
          }

          return {
            icon: entity.options.icon,
            simpleName: entity.options.name,
            complexName: entity.getTypeDisplayName(),
            iconColor: !(entity instanceof ParameterizedAction) ? 'orange' : 'mediumpurple',
            labels: [
              {
                label: 'Hotkeys',
                value: `${entity.options.hotkeys?.length || 0}`,
                icon: {
                  name: 'keyboard',
                  color: 'rgba(255,255,255,0.5)'
                }
              },
              {
                label: 'Validators',
                value: `${entity.options.validators?.length || 0}`,
                icon: {
                  name: 'shield',
                  color: 'rgba(255,255,255,0.5)'
                }
              },
              {
                label: 'Behavior',
                value: behavior,
                icon: {
                  name: 'bolt',
                  color: 'rgba(255,255,255,0.5)'
                }
              },
              {
                label: 'Rollback',
                value: rollback,
                icon: {
                  name: 'rotate-left',
                  color: 'rgba(255,255,255,0.5)'
                }
              }
            ],
            tags
          };
        }
      })
    );
    this.registerComponent(new ActionEntityHandler());
    this.registerComponent(new ActionEntityEncoder());
    this.registerComponent(new InlineTreePresenterComponent<Action>());
    this.registerComponent(new EntityCardsPresenterComponent<Action>());
    this.registerComponent(new ActionTreePresenter());
    this.registerComponent(
      new EntityPanelComponent<Action>({
        // used to be the actions panel
        legacyType: 'actions',
        label: 'Actions',
        getEntities: () => {
          return this.system.getActions();
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
