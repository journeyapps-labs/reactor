import { EntityDefinition } from '../../entities/EntityDefinition';
import { ReactorEntities, ReactorEntityCategories } from '../ReactorEntities';
import { ActionEntityEncoder } from './ActionEntityEncoder';
import { Action, ParameterizedAction } from '../../actions';
import { ActionEntityHandler } from './ActionEntityHandler';
import { EntityPanelComponent } from '../../entities/components/ui/EntityPanelComponent';
import { InlineTreePresenterComponent } from '../../entities/components/presenter/types/tree/InlineTreePresenterComponent';
import { ActionTreePresenter } from './ActionTreePresenter';
import { EntityDescriberComponent } from '../../entities/components/meta/EntityDescriberComponent';
import { ActionSearchEngineComponent } from './ActionSearchEngineComponent';

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
            simpleName: entity.options.name
          };
        }
      })
    );
    this.registerComponent(
      new EntityDescriberComponent<Action>({
        label: 'Advanced',
        describe: (entity: Action) => {
          return {
            icon: entity.options.icon,
            simpleName: entity.options.name,
            complexName: entity.getTypeDisplayName(),
            iconColor: !(entity instanceof ParameterizedAction) ? 'orange' : 'mediumpurple'
          };
        }
      })
    );
    this.registerComponent(new ActionEntityHandler());
    this.registerComponent(new ActionEntityEncoder());
    this.registerComponent(new InlineTreePresenterComponent<Action>());
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
