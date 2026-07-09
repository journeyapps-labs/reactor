import { EntityDefinitionComponent } from '../../EntityDefinitionComponent';
import { ComboBoxItem } from '../../../stores/combo/ComboBoxDirectives';
import { MousePosition } from '../../../layers/combo/SmartPositionWidget';
import { ActionSource } from '../../../actions/Action';
import { v4 } from 'uuid';

export interface OpenEntityEvent<T> {
  entity: T;
  position: MousePosition;
  source: ActionSource;
}

export interface EntityHandlerComponentOptions {
  preferred?: boolean;
}

export abstract class EntityHandlerComponent<T extends any = any> extends EntityDefinitionComponent {
  static TYPE = 'handler';
  uuid: string;
  readonly preferred: boolean;

  constructor(options: EntityHandlerComponentOptions = {}) {
    super(EntityHandlerComponent.TYPE);
    this.uuid = v4();
    this.preferred = options.preferred ?? false;
  }

  abstract openEntity(event: OpenEntityEvent<T>): Promise<any>;

  abstract getDescription(entity: T): Omit<ComboBoxItem, 'key'>;

  getPreferredActionId(): string | null {
    return null;
  }
}
