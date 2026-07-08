import { ioc } from '../../../inversify.config';
import { System } from '../../../core/System';
import { ActionStore } from '../../actions/ActionStore';
import { FormModel } from '../../../forms/FormModel';
import { ArraySetInput } from '../../../forms/controls/collection/ArraySetInput';
import { SelectInput } from '../../../forms/controls/SelectInput';
import type { ComboBoxItem } from '../../combo/ComboBoxDirectives';

export interface WorkspaceOptionsFormModelOptions {
  preferredOpenActions: Record<string, string>;
}

export interface WorkspaceOptionsFormValue {
  preferredOpenActions: Record<string, string>;
}

export class WorkspaceOptionsFormModel extends FormModel<WorkspaceOptionsFormValue> {
  constructor(protected options: WorkspaceOptionsFormModelOptions) {
    super();
    this.addInput(
      new ArraySetInput<string>({
        name: 'preferredOpenActions',
        label: 'Preferred open actions',
        value: { ...this.options.preferredOpenActions },
        entries: this.getEntityEntries(),
        addbutton: {
          label: 'Add entity'
        },
        generate: (entityType) => {
          const actionOptions = this.getOpenActionOptions(entityType);
          return new SelectInput({
            name: entityType,
            label: 'Open action',
            value: this.options.preferredOpenActions[entityType] || Object.keys(actionOptions)[0],
            options: actionOptions,
            required: true
          });
        }
      })
    );
  }

  protected getOpenActionOptions(entityType: string): Record<string, string> {
    const system = ioc.get(System);
    const actionStore = ioc.get(ActionStore);
    const definition = system.getDefinition(entityType);
    return (definition?.getHandlers() || []).reduce(
      (options, handler) => {
        const actionId = handler.getPreferredActionId();
        if (!actionId) {
          return options;
        }
        const action = actionStore.getActionByID(actionId);
        options[actionId] = action?.options.name || actionId;
        return options;
      },
      {} as Record<string, string>
    );
  }

  protected getDefaultOpenAction(entityType: string): string | null {
    return Object.keys(this.getOpenActionOptions(entityType))[0] || null;
  }

  protected getEntityEntries(): ComboBoxItem[] {
    const system = ioc.get(System);
    return system
      .getEntityDefinitions()
      .filter((definition) => Object.keys(this.getOpenActionOptions(definition.type)).length > 0)
      .map((definition) => {
        return {
          key: definition.type,
          title: definition.label,
          icon: definition.icon,
          color: definition.iconColor
        } as ComboBoxItem;
      });
  }

  getPreferredOpenActions(): Record<string, string> {
    const value = this.value().preferredOpenActions || {};
    return Object.entries(value).reduce(
      (preferredOpenActions, [entityType, actionId]) => {
        const resolvedActionId = actionId || this.getDefaultOpenAction(entityType);
        if (resolvedActionId) {
          preferredOpenActions[entityType] = resolvedActionId;
        }
        return preferredOpenActions;
      },
      {} as Record<string, string>
    );
  }
}
