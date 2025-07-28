import { EntityDefinitionComponent } from '../../EntityDefinitionComponent';
import { ReactorIcon } from '../../../widgets';
import { BaseListener } from '@journeyapps-labs/lib-reactor-utils';

export interface EntityDescription {
  simpleName: string;
  complexName?: string;
  icon?: ReactorIcon;
  iconColor?: string;
}

export interface EntityDescriberComponentOptions<T> {
  label: string;
  describe: (entity: T) => EntityDescription;
}

export interface EntityDescriberComponentListener extends BaseListener {
  preferred: () => any;
}

export class EntityDescriberComponent<T> extends EntityDefinitionComponent<EntityDescriberComponentListener> {
  static TYPE = 'describer';

  constructor(protected options: EntityDescriberComponentOptions<T>) {
    super(EntityDescriberComponent.TYPE);
  }

  describeEntity(t: T): EntityDescription {
    let desc = this.options.describe(t);

    let color = this.definition.iconColor;
    if (color === this.definition.iconColorDefault) {
      color = desc.iconColor || color;
    }

    return {
      ...desc,
      icon: desc.icon || this.definition.icon,
      iconColor: color
    };
  }

  get label() {
    return this.options.label;
  }

  setPreferred() {
    this.iterateListeners((cb) => cb.preferred?.());
  }
}
