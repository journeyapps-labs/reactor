import { HandleDropEvent } from './AbstractDropZone';
import { inject } from '../../../inversify.config';
import { System } from '../../../core/System';
import { ActionSource, CoupledAction } from '../../../actions';
import { EntityDefinition } from '../../../entities/EntityDefinition';
import { EncodedEntity } from '../../../entities/components/encoder/EntityEncoderComponent';
import * as _ from 'lodash';
import { ComboBoxStore2 } from '../../combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../../combo2/directives/SimpleComboBoxDirective';
import { NotificationStore } from '../../NotificationStore';
import { MousePosition } from '../../../layers/combo/SmartPositionWidget';
import { DialogStore } from '../../DialogStore';
import { AbstractEntityDropZone, EntityMimeEncoding } from './AbstractEntityDropZone';

export class CoupledEntityDropZone extends AbstractEntityDropZone {
  @inject(System)
  accessor system: System;

  @inject(ComboBoxStore2)
  accessor comboBoxStore2: ComboBoxStore2;

  @inject(NotificationStore)
  accessor notificationStore: NotificationStore;

  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  definition: EntityDefinition<unknown>;
  coupledActions: CoupledAction[];
  entity_id: string;

  constructor(protected entity: any) {
    super();
    this.definition = this.system.getDefinitionForEntity(entity);
    if (!this.definition) {
      console.error(`Cannot find definition for entity: `, entity);
    }
    this.coupledActions = this.system
      .getActions()
      .filter((a) => a instanceof CoupledAction)
      .filter((a: CoupledAction) => {
        return a.options.target === this.definition.type;
      }) as CoupledAction[];
    this.entity_id = this.definition.getEntityUID(entity);
  }

  async processAction(action: CoupledAction, entitiesEncoded: EncodedEntity[], position: MousePosition) {
    let entitiesDecoded = await Promise.all(
      entitiesEncoded.map((entityEncoded) => this.system.decodeEntity(entityEncoded))
    );

    for (let e of entitiesDecoded) {
      await action.fireAction({
        sourceEntity: e,
        targetEntity: this.entity,
        source: ActionSource.DND,
        position: position
      });
    }
    if (entitiesDecoded.length > 1) {
      this.notificationStore.showNotification({
        title: 'Success',
        description: `${entitiesDecoded.length} entities were processed`
      });
    }
  }

  protected async _handleDrop(event: HandleDropEvent, entities: any[]) {
    const items = _.chain(entities)
      .groupBy((i) => {
        return i.type;
      })
      .flatMap((selections, type) => {
        return this.coupledActions
          .filter((a) => a.options.source === type)
          .map((a) => {
            return {
              ...a.representAsComboBoxItem(),
              group: `${this.system.getDefinition(type).label} actions`,
              action: async () => {
                this.processAction(a, selections, event.position);
              }
            };
          });
      })
      .value();

    this.comboBoxStore2.show(
      new SimpleComboBoxDirective({
        event: event.position,
        items: items,
        title: 'Batch actions',
        subtitle: `${entities.length} found`
      })
    );
  }

  protected _acceptsEncodedObject(encoded: EntityMimeEncoding): boolean {
    if (encoded.id === this.entity_id) {
      return false;
    }

    return this.coupledActions.some((action) => action.options.source === encoded.type);
  }
}
