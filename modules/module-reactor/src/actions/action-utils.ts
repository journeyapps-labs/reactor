import { Action, ActionRollbackMechanic } from './Action';
import { ioc } from '../inversify.config';
import { DialogStore } from '../stores';
import { BatchStore } from '../stores/batch/BatchStore';
import { EntityAction, EntityActionEvent } from './parameterized/EntityAction';
import { System } from '../core/System';

export interface SetupDeleteConfirmationOptions {
  action: Action;
  title?: string;
  message?: string;
}

export const setupDeleteConfirmation = (options: SetupDeleteConfirmationOptions) => {
  let batching = false;

  const batchStore = ioc.get(BatchStore);
  const system = ioc.get(System);
  const dialogStore = ioc.get(DialogStore);

  batchStore.registerListener({
    willFireBatchActions: () => {
      batching = true;
    },
    finishedFiringBatchActions: () => {
      batching = false;
    }
  });
  options.action.registerListener({
    willFire: async (event) => {
      // if the batch store is firing actions, disregard this check as it is handled there
      if (batching) {
        return;
      }

      let rollbackMessage = `This operation cannot be reversed.`;
      if (options.action.options.rollbackMechanic === ActionRollbackMechanic.SCM) {
        rollbackMessage = `Rollback may be possible by reverting source code changes, if a commit / revision already exists.`;
      }

      const computeMessage = () => {
        if (options.message) {
          return options.message;
        }

        if (options.action instanceof EntityAction) {
          let eventCast = event.payload as EntityActionEvent;
          if (eventCast.targetEntity) {
            let def = system.getDefinitionForEntity(eventCast.targetEntity);
            if (def) {
              return `You have selected ${def.label}: __${def.describeEntity(eventCast.targetEntity).simpleName}__.

${rollbackMessage} `;
            }
          }
        }

        return rollbackMessage;
      };

      const confirm = await dialogStore.showConfirmDialog({
        title: options.title || `${options.action.options.name}?`,
        markdown: computeMessage()
      });
      if (!confirm) {
        event.payload.canceled = true;
      }
    }
  });
};
