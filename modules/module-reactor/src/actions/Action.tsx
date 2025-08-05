import { MousePosition } from '../layers/combo/SmartPositionWidget';
import { System } from '../core/System';
import { ReactorIcon } from '../widgets/icons/IconWidget';
import { VisorStore } from '../stores/visor/VisorStore';
import { inject } from '../inversify.config';
import { LoadingDirectiveState, VisorLoadingDirective } from '../stores/visor/VisorLoadingDirective';
import { DialogStore } from '../stores/DialogStore';
import { ActionValidator, PassiveActionValidationState, ValidationResult } from './validators/ActionValidator';
import { Btn } from '../definitions/common';
import * as React from 'react';
import { ShortcutChord } from '../stores/shortcuts/Shortcut';
import { ComboBoxItem } from '../stores/combo/ComboBoxDirectives';
import { SystemInterface } from '../core/SystemInterface';
import * as _ from 'lodash';
import { ActionValidatorContext } from './validators/ActionValidatorContext';
import { ActionButtonControl, ActionButtonWidget, EventType } from '../controls/ActionButtonControl';
import { ActionMetaWidget } from './ActionMetaWidget';
import { processCallbackWithValidation } from '../hooks/useValidator';
import { BaseObserver } from '@journeyapps-labs/common-utils';
import { Logger } from '@journeyapps-labs/common-logger';
import { createLogger } from '../core/logging';

export interface SerializedAction {
  _action: string;
}

export enum ActionMacroBehavior {
  /**
   * Will remove
   */
  DELETE = 'delete',
  /**
   * Will change
   */
  DESTRUCTIVE = 'destructive',

  /*
    Will clone
   */
  COPY = 'copy'
}

export enum ActionRollbackMechanic {
  /**
   * There is no way to rollback
   */
  NONE = 'none',
  /*
    Rollback happens via SCM
   */
  SCM = 'scm'
}

export interface ActionOptions {
  id: string;
  name: string;
  category?: {
    entityType?: string;
    grouping?: string;
  };
  icon: ReactorIcon;
  hotkeys?: ShortcutChord[];
  validators?: ActionValidator[];
  hideFromCmdPallet?: boolean;
  exemptFromExclusiveExecutionLock?: boolean;
  behavior?: ActionMacroBehavior;
  rollbackMechanic?: ActionRollbackMechanic;
}

export enum ActionSource {
  COMMAND_PALLET = 'cmd-palette',
  BUTTON = 'button',
  TREE_LEAF = 'tree-leaf',
  COMBO_BOX_CALLOUT = 'combo-box-callout',
  RIGHT_CLICK = 'right-click',
  ACTION = 'action-chain',
  DND = 'dnd',
  HOTKEY = 'hotkey',
  NETWORK_EVENT = 'network-event',
  VISOR = 'visor',
  GUIDE = 'guide'
}

export interface ActionComboBoxItem<T extends Action = Action> extends ComboBoxItem {
  actionObject: T;
}

export interface ActionEvent {
  id: string;
  source: ActionSource;
  position?: MousePosition;
  getStatus?: () => VisorLoadingDirective;
  canceled?: boolean;
  fireBehaviorChecks?: boolean;
}

export interface ActionListener<E extends ActionEvent = ActionEvent> {
  willFire: (event: { payload: Partial<E> }) => Promise<void>;
  didFire: (event: { payload: Partial<E>; status: LoadingDirectiveState; success: boolean }) => void;
  cancelled: (event: { payload: Partial<E> }) => void;
}

export interface ActionGenerics {
  OPTIONS: ActionOptions;
  EVENT: ActionEvent;
}

export abstract class Action<
  P extends Partial<ActionGenerics> = Partial<ActionGenerics>,
  T extends ActionGenerics & P = ActionGenerics & P,
  L extends ActionListener<T['EVENT']> = ActionListener<T['EVENT']>
> extends BaseObserver<L> {
  options: T['OPTIONS'];
  application: SystemInterface;

  private singletonValidationContext: ActionValidatorContext;
  protected logger: Logger;

  @inject(VisorStore)
  accessor visorStore: VisorStore;

  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  constructor(options: T['OPTIONS']) {
    super();
    this.options = {
      ...options,
      hotkeys: options.hotkeys || []
    };
    this.logger = createLogger(options.name);
    this.singletonValidationContext = null;
  }

  get id() {
    return this.options.id;
  }

  generateValidationContext() {
    return new ActionValidatorContext(this);
  }

  /**
   * @deprecated rather use generateValidationContext and dispose afterwards
   */
  validatePassively(): PassiveActionValidationState {
    if (!this.singletonValidationContext) {
      this.singletonValidationContext = this.generateValidationContext();
    }
    return this.singletonValidationContext.validatePassively();
  }

  getExclusiveExecutionLock(event?: { allowed?: (e: Partial<T['EVENT']>) => boolean }): () => any {
    this.logger.debug('Getting exclusivity lock');
    const listener = this.application.registerListener({
      actionWillFire: async (globalEvent) => {
        // we allow some actions to fire
        if (globalEvent.action.options.exemptFromExclusiveExecutionLock) {
          return true;
        }

        // now we check this specific action
        if (this.options.id !== globalEvent.action.options.id) {
          globalEvent.action.logger.debug('is not allowed to execute');
          globalEvent.event.canceled = true;
          return;
        }

        // now we allow the dev check if this should fire, probably based on the parameters
        if (event?.allowed && !event.allowed(globalEvent.event as Partial<T['EVENT']>)) {
          globalEvent.action.logger.debug('params are not what we are looking for');
          globalEvent.event.canceled = true;
          return;
        }
      }
    });
    return () => {
      this.logger.debug('Releasing exclusivity lock');
      listener();
    };
  }

  get group() {
    if (this.options.category?.grouping) {
      return _.chain(this.options.category?.grouping).trim().capitalize().value();
    }
    return null;
  }

  representAsComboBoxItem(
    options: { installAction: boolean; eventData?: Partial<T['EVENT']> } = { installAction: false }
  ): ActionComboBoxItem<this> {
    const validator = this.generateValidationContext();
    const action = {
      icon: this.options.icon,
      color: 'orange',
      title: this.options.name,
      key: this.options.name,
      actionObject: this,
      group: this.group,
      disabled: validator.validatePassively() === PassiveActionValidationState.DISABLED,
      right: <ActionMetaWidget action={this} />
    } as ActionComboBoxItem<this>;
    if (validator.validatePassively() === PassiveActionValidationState.DISALLOWED) {
      return null;
    }
    if (options.installAction) {
      action.action = (e) => {
        return processCallbackWithValidation(() => {
          return this.fireAction({
            source: ActionSource.RIGHT_CLICK,
            position: e,
            ...(options?.eventData || {})
          } as T['EVENT']);
        }, validator.validate());
      };
    }
    return action;
  }

  representAsIcon(extraData: Partial<T['EVENT']> = {}): Btn {
    const data = this.representAsButton(extraData, true);
    if (!data) {
      return null;
    }
    return {
      ...data,
      label: null
    };
  }

  representAsControl(options: { eventData?: Partial<T['EVENT']> } = {}) {
    return new ActionButtonControl({ action: this, getEventData: () => options.eventData as EventType<this> });
  }

  /**
   * @deprecated use representAsControl
   */
  representAsButton(extraData: Partial<T['EVENT']> = {}, validate: boolean = false): Btn {
    if (validate) {
      const validate = this.validatePassively();
      if (validate === PassiveActionValidationState.DISALLOWED) {
        return null;
      }
    }
    return {
      label: this.options.name,
      tooltip: this.options.name,
      icon: this.options.icon,
      validator: this.generateValidationContext(),
      action: async (event, loading?: (loading: boolean) => any) => {
        loading?.(true);
        await this.fireAction({
          source: ActionSource.BUTTON,
          position: event,
          ...extraData
        } as unknown as T['EVENT']);
        loading?.(false);
      }
    };
  }

  renderAsButton(
    render: (btn: Btn, result: ValidationResult) => React.JSX.Element,
    extraData: Partial<T['EVENT']> = {}
  ): React.JSX.Element {
    return (
      <ActionButtonWidget
        action={this}
        render={() => {
          // @ts-ignore
          return render(this.representAsButton(extraData));
        }}
      />
    );
  }

  getTypeDisplayName() {
    return 'Standard Action';
  }

  setApplication(app: System) {
    this.application = app;
  }

  serialize(): SerializedAction {
    return {
      _action: this.options.name
    };
  }

  //!---------------- ACTION LIFECYCLE -----------------

  protected _generateActionEvent(event: Omit<T['EVENT'], 'id'>) {
    const status = new VisorLoadingDirective(`Running action: ${this.options.name}`);
    let status_pushed = false;
    return {
      ...event,
      id: this.options.id,
      canceled: event.canceled ?? false,
      getStatus: () => {
        if (!status_pushed) {
          this.visorStore.pushLoadingDirective(status);
          status_pushed = true;
        }
        return status;
      }
    } as T['EVENT'];
  }

  /**
   * Action will-fire events and returns true if the action can fire
   */
  protected async _preflightChecks(event: T['EVENT']) {
    if (this.validatePassively() !== PassiveActionValidationState.ALLOWED) {
      return false;
    }

    await this.iterateAsyncListeners((cb) => {
      return cb.willFire?.({
        payload: event
      });
    });

    // was the event canceled
    if (event.canceled) {
      this.logger.debug('Canceled');
      this.iterateListeners((cb) =>
        cb.cancelled?.({
          payload: event
        })
      );
      return false;
    }
    return true;
  }

  /**
   * Run the action with error handling
   */
  protected async _runAction(event: T['EVENT']) {
    try {
      // everything is good to go, fire the event
      const result = await this.fireEvent(event);
      event.getStatus().complete();
      return result;
    } catch (ex) {
      console.error(ex);
      this.dialogStore.showErrorDialog({
        title: `Action: ${this.options.name} failed`,
        message: 'Check the console for more information.'
      });
      event.getStatus().failed();
      throw ex;
    }
  }

  /**
   * Runs the action, but with tracing
   * // TODO this can actually be setup on the system
   */
  protected async _runActionInTrace(event: T['EVENT']) {
    const trace = this.application.tracer.createActionTrace(event);
    try {
      const res = await this._runAction(event);
      trace.end(true);
      return res;
    } catch (ex) {
      trace.end(false);
    }
  }

  /**
   * Runs at the end of the action
   */
  protected _postFlightChecks(event: T['EVENT'], result) {
    this.iterateListeners((cb) => {
      cb.didFire?.({
        payload: event,
        status: event.getStatus().state,
        success: !!result
      });
    });
  }

  async fireAction(event: Omit<T['EVENT'], 'id'>) {
    // 1. create event
    const modified_event = this._generateActionEvent(event);
    // 2. check if we can run
    const preflight_check = await this._preflightChecks(modified_event);
    if (!preflight_check) {
      return;
    }
    // 3. run!
    const result = await this._runActionInTrace(modified_event);

    // 4. cleanup
    this._postFlightChecks(modified_event, result);
    return result;
  }

  protected abstract fireEvent(event: T['EVENT']): Promise<true | false | void>;
}
