import { EntityDefinitionComponent } from '../../EntityDefinitionComponent';
import { EntityPanelFactory, EntityPanelModel } from './widgets/EntityPanelFactory';
import { ReactorIcon } from '../../../widgets/icons/IconWidget';
import { Action } from '../../../actions';
import { EntityPresenterComponent } from '../presenter/EntityPresenterComponent';
import * as _ from 'lodash';

export interface GetEntityEvent<T> {
  presenter: EntityPresenterComponent<T>;
  model: EntityPanelModel;
}

export interface EntityPanelComponentOptions<T extends any> {
  legacyType?: string;
  label?: string;
  /**
   * The label of the default presenter, if null will select the first one
   */
  defaultPresenter?: string;
  icon?: ReactorIcon;
  iconColor?: string;
  getEntities: (event: GetEntityEvent<T>) => T[];
  isLoading?: () => boolean;
  additionalActions?: string[];
}

export class EntityPanelComponent<T extends any = any> extends EntityDefinitionComponent {
  static TYPE = 'entity-panel';

  additionalActions: string[];

  constructor(public options: EntityPanelComponentOptions<T>) {
    super(EntityPanelComponent.TYPE);
    this.additionalActions = options.additionalActions || [];
  }

  getEntities(event: GetEntityEvent<T>): T[] {
    return this.options.getEntities(event);
  }

  registerAdditionalAction(action: Action) {
    this.additionalActions.push(action.id);
  }

  generatePanelFactory = _.memoize(() => {
    return new EntityPanelFactory(this);
  });

  get defaultPresenterLabel() {
    return this.options.defaultPresenter;
  }

  get icon() {
    return this.options.icon || this.definition.icon;
  }

  get iconColor() {
    return this.options.iconColor || this.definition.icon;
  }

  generateFactoryType() {
    if (this.options.legacyType) {
      return this.options.legacyType;
    }
    return `entity-panel-${this.definition.type}`;
  }
}
