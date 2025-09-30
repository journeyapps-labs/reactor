import { action, observable } from 'mobx';
import * as _ from 'lodash';
import { EncodedEntity } from '../../entities/components/encoder/EntityEncoderComponent';
import { ComboBoxStore2 } from '../combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../combo2/directives/simple/SimpleComboBoxDirective';
import { ActionMacroBehavior, ActionRollbackMechanic, ActionSource, EntityAction } from '../../actions';
import { MousePosition, ReactorIcon } from '../../widgets';
import { System } from '../../core/System';
import { VisorStore } from '../visor/VisorStore';
import { ioc } from '../../inversify.config';
import { createRef } from 'react';
import { AbstractStore, AbstractStoreListener } from '../AbstractStore';
import { DialogStore } from '../DialogStore';
import { parallelLimit } from 'async';

export interface BatchStoreOptions {
  comboBoxStore: ComboBoxStore2;
  dialogStore: DialogStore;
  system: System;
  visorStore: VisorStore;
}

export interface BatchStoreListener extends AbstractStoreListener {
  willFireBatchActions: () => any;
  finishedFiringBatchActions: () => any;
}

export class BatchStore extends AbstractStore<any, BatchStoreListener> {
  @observable
  accessor selections: EncodedEntity[];

  ref: React.RefObject<HTMLDivElement>;

  constructor(protected options2: BatchStoreOptions) {
    super({
      name: 'BATCH_STORE'
    });
    this.selections = [];
    this.ref = createRef();
  }

  getEntityIndex(entity: EncodedEntity) {
    if (!entity) {
      return -1;
    }
    return this.selections.findIndex((e) => _.isEqual(e, entity));
  }

  isSelected(entity: EncodedEntity) {
    if (!entity) {
      return false;
    }
    return this.getEntityIndex(entity) !== -1;
  }

  getSelectionIconRef(): Element {
    return this.ref.current;
  }

  getSelectionIcon(): ReactorIcon {
    for (let selection of this.selections) {
      return ioc.get(System).getDefinition(selection.type).icon;
    }
    return 'cube';
  }

  select(entity: EncodedEntity) {
    let index = this.getEntityIndex(entity);
    if (index === -1) {
      this.selections.push(entity);
    } else {
      this.selections.splice(index, 1);
    }
  }

  clearSelection() {
    this.selections = [];
  }

  @action selectAll(entities: EncodedEntity[]) {
    this.selections = [...entities];
  }

  selectOne(entity: EncodedEntity) {
    this.selections = [entity];
  }

  getBatchActionsForType(type: string): EntityAction[] {
    return _.values(this.options2.system.actions)
      .filter((a) => {
        return a instanceof EntityAction;
      })
      .filter((a: EntityAction) => {
        return a.options.batch && a.options.target === type;
      }) as EntityAction[];
  }

  showContextMenu(position: MousePosition) {
    const items = _.chain(this.selections)
      .groupBy((i) => {
        return i.type;
      })
      .flatMap((selections, type) => {
        return this.getBatchActionsForType(type).map((a) => {
          return {
            ...a.representAsComboBoxItem(),
            group: `${this.options2.system.getDefinition(type).label} actions`,
            action: async () => {
              return this.batchProcessAction(a, position);
            }
          };
        });
      })
      .value();

    this.options2.comboBoxStore.show(
      new SimpleComboBoxDirective({
        event: position,
        items: items,
        title: 'Batch actions',
        subtitle: `${this.selections.length} selected`
      })
    );
  }

  async batchProcessAction(action: EntityAction, position: MousePosition) {
    const items = await Promise.all(
      this.selections.filter((s) => s.type === action.options.target).map((s) => this.options2.system.decodeEntity(s))
    );

    // for delete operations, lets just confirm once off with the user
    // action preflights checks will probably disable their own confirmation checks as well
    if (
      action.options.behavior === ActionMacroBehavior.DELETE ||
      action.options.behavior === ActionMacroBehavior.DESTRUCTIVE
    ) {
      let message = 'This batch operation cannot be undone.';

      // some changes can be rolled back via SCM
      if (action.options.rollbackMechanic === ActionRollbackMechanic.SCM) {
        message = 'This operation can be undone via reverting source code changes.';
      }

      const confirm = await this.options2.dialogStore.showConfirmDialog({
        title: `Run '${action.options.name}' on ${items.length} items?`,
        message: message
      });
      if (!confirm) {
        return;
      }
    }

    // now we just batch process
    this.iterateListeners((cb) => cb.willFireBatchActions?.());
    return this.options2.visorStore
      .wrap('Processing batch actions', async (directive) => {
        directive.update(10);
        let processed = 0;
        await parallelLimit(
          items.map((i) => {
            return async () => {
              await action.fireAction({
                source: ActionSource.RIGHT_CLICK,
                position: position,
                targetEntity: i
              });
              processed++;
              directive.update((processed / items.length) * 100);
            };
          }),
          action.options.batch_concurrency
        );
        directive.complete();
      })
      .finally(() => {
        this.iterateListeners((cb) => cb.finishedFiringBatchActions?.());
      });
  }
}
