import { EntityDefinitionComponent } from '../../EntityDefinitionComponent';
import { ReactorIcon } from '../../../widgets/icons/IconWidget';

export interface EntityLabel {
  label: string;
  value: string;
  color?: string;
  colorForeground?: string;
  icon?: {
    name: ReactorIcon;
    color: string;
    spin?: boolean;
  };
  active?: boolean;
  tooltip?: string;
}

export interface EntityDescription {
  simpleName: string;
  complexName?: string;
  icon?: ReactorIcon;
  iconColor?: string;
  /**
   * Optional metadata entries shown by card-style presenters.
   */
  labels?: EntityLabel[];
  /**
   * Optional tag chips shown by card-style presenters.
   */
  tags?: string[];
}

export interface EntityDescriberComponentOptions<T> {
  label: string;
  describe: (entity: T) => EntityDescription;
}

export interface EntityDescriberComponentListener {
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
