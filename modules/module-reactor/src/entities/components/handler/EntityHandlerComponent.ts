import { EntityDefinitionComponent } from '../../EntityDefinitionComponent';
import { ComboBoxItem } from '../../../stores';
import { MousePosition } from '../../../widgets';
import { ActionSource } from '../../../actions';
import { v4 } from 'uuid';

export interface OpenEntityEvent<T> {
  entity: T;
  position: MousePosition;
  source: ActionSource;
}

export abstract class EntityHandlerComponent<T extends any = any> extends EntityDefinitionComponent {
  static TYPE = 'handler';
  uuid: string;

  constructor() {
    super(EntityHandlerComponent.TYPE);
    this.uuid = v4();
  }

  abstract openEntity(event: OpenEntityEvent<T>): Promise<any>;

  abstract getDescription(entity: T): Omit<ComboBoxItem, 'key'>;
}
