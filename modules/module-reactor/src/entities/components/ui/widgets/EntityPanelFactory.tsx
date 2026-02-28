import * as React from 'react';
import { EntityPanelWidget } from './EntityPanelWidget';
import { EntityPanelComponent } from '../EntityPanelComponent';
import { EntityPresenterComponent, SelectEntityListener } from '../../presenter/EntityPresenterComponent';
import { observable } from 'mobx';
import {
  PanelTitleToolbarWidget,
  PanelToolbarButton
} from '../../../../widgets/panel/panel/title/PanelTitleToolbarWidget';
import { inject } from '../../../../inversify.config';
import { BatchStore } from '../../../../stores/batch/BatchStore';
import { ComboBoxStore2 } from '../../../../stores/combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../../../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { ReactorPanelFactory } from '../../../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../../../../stores/workspace/react-workspaces/ReactorPanelModel';
import {
  RenderTitleBarEvent,
  WorkspaceModelFactoryEvent,
  WorkspaceModelListener
} from '@projectstorm/react-workspaces-core';
import { Btn } from '../../../../definitions/common';
import { System } from '../../../../core/System';
import * as _ from 'lodash';
import { AbstractPresenterContext } from '../../presenter/AbstractPresenterContext';
import { ActionStore } from '../../../../stores/actions/ActionStore';
import { EntityDefinitionError } from '../../../EntityDefinitionError';
import { EntityTreePresenterSetting } from '../../presenter/types/tree/EntityTreePresenterComponent';

export interface EntityPanelModelListener<T extends any = any> extends WorkspaceModelListener, SelectEntityListener<T> {
  contextGenerated: (context: AbstractPresenterContext<T>) => any;
}

export class EntityPanelModel<T extends any = any> extends ReactorPanelModel<EntityPanelModelListener<T>> {
  @observable
  accessor presenter: string;

  @observable
  accessor presenterContext: AbstractPresenterContext<T>;

  @inject(ComboBoxStore2)
  accessor comboBoxStore: ComboBoxStore2;

  constructor(protected factory: EntityPanelFactory<T>) {
    super(factory.type);
    this.setExpand(false, true);
    this.presenterContext = null;
    this.setPresenter(factory.component.defaultPresenterLabel);
  }

  setPresenter(key: string) {
    this.presenter = key;
    this.presenterContext?.dispose();
    const context = this.getPresenter().generateContext();
    this.iterateListeners((cb) => cb.contextGenerated?.(context));
    this.presenterContext = context;
    const l1 = this.presenterContext.registerListener({
      stateChanged: () => {
        this.triggerSerialize();
      },
      disposed: () => {
        l1?.();
      }
    });
  }

  getPresenter(): EntityPresenterComponent<T> {
    let presenters = this.factory.component.definition.getPresenters();
    if (presenters.length === 0) {
      throw new EntityDefinitionError({
        definition: this.factory.component.definition,
        message:
          `Entity panel "${this.factory.type}" cannot be created because definition ` +
          `"${this.factory.component.definition.type}" has no presenters registered.`,
        context: {
          panelType: this.factory.type,
          requestedPresenterKey: this.presenter
        }
      });
    }
    let found = presenters.find((p) => {
      return p.label === this.presenter;
    });
    if (found) {
      return found;
    }
    return presenters[0];
  }

  async selectEntity(entity: T) {
    if (!this.r_visible) {
      await new Promise<void>((resolve) => {
        const l1 = this.registerListener({
          visibilityChanged: () => {
            l1?.();
            _.defer(() => {
              resolve();
            });
          }
        });
      });
    }
    this.iterateListeners((cb) => cb.selectEntity?.(entity));
  }

  get component() {
    return this.factory.component;
  }

  get definition() {
    return this.component.definition;
  }

  isLoading() {
    return !!this.factory.component.options.isLoading?.();
  }

  getElements() {
    return this.factory.component.getEntities({
      presenter: this.getPresenter(),
      model: this
    });
  }

  toArray() {
    return {
      ...super.toArray(),
      uiState: this.presenterContext?.serialize(),
      presenter: this.presenter
    };
  }

  fromArray(payload: ReturnType<this['toArray']>, engine) {
    super.fromArray(payload, engine);
    if (payload.presenter) {
      this.setPresenter(payload.presenter);
    }

    if (payload.uiState && this.presenterContext) {
      this.presenterContext.deserialize(payload.uiState);
    }
  }
}

export class EntityPanelFactory<T> extends ReactorPanelFactory<EntityPanelModel<T>> {
  @inject(ComboBoxStore2)
  accessor comboBoxStore: ComboBoxStore2;

  @inject(BatchStore)
  accessor batchStore: BatchStore;

  @inject(System)
  accessor system: System;

  @inject(ActionStore)
  accessor actionStore: ActionStore;

  constructor(public component: EntityPanelComponent) {
    super({
      type: component.generateFactoryType(),
      icon: component.options.icon || component.definition.icon,
      name: component.options.label || component.definition.label,
      color: component.options.iconColor || component.definition.iconColor,
      allowManualCreation: true,
      category: component.definition.category,
      fullscreen: false,
      isMultiple: true
    });
  }

  matchesModel(newModel: EntityPanelModel<T>, existingModel: EntityPanelModel<T>): boolean {
    return newModel.type === existingModel.type;
  }

  getAdditionalButtons(event: RenderTitleBarEvent<EntityPanelModel<T>>): Btn[] {
    return [
      ...super.getAdditionalButtons(event),
      ...this.component.additionalActions.map((a) =>
        this.actionStore.getActionByID(a).representAsControl().representAsBtn()
      )
    ];
  }

  getPresenterSelectionContext(event: WorkspaceModelFactoryEvent<EntityPanelModel>) {
    const presenters = this.component.definition.getPresenters();
    if (presenters.length === 1) {
      return null;
    }
    return {
      name: `View: ${event.model.getPresenter().label}`,
      tracking: false,
      onChange: async (event2) => {
        await this.comboBoxStore.show(
          new SimpleComboBoxDirective({
            items: presenters.map((p) => {
              return {
                title: p.label,
                key: p.label,
                action: async () => {
                  event.model.setPresenter(p.label);
                }
              };
            }),
            event: event2
          })
        );
      }
    };
  }

  getDescriberSelectionContext(event: WorkspaceModelFactoryEvent<EntityPanelModel>) {
    const describers = this.component.definition.getDescribers();
    if (describers.length === 1) {
      return null;
    }
    return {
      name: `Info: ${this.component.definition.getPreferredDescriber()?.label}`,
      tracking: false,
      onChange: async (event2) => {
        await this.comboBoxStore.show(
          new SimpleComboBoxDirective({
            items: describers.map((p) => {
              return {
                title: p.label,
                key: p.label,
                action: async () => {
                  p.setPreferred();
                }
              };
            }),
            event: event2
          })
        );
      }
    };
  }

  getSelectAllButton(event: WorkspaceModelFactoryEvent<EntityPanelModel>): PanelToolbarButton | null {
    if (this.component.definition.isMultiSelectable()) {
      return {
        icon: 'square-check',
        enabled: false,
        tooltip: 'Select all',
        action: () => {
          this.batchStore.selectAll(event.model.getElements().map((e) => this.component.definition.encode(e)));
        }
      };
    }
    return null;
  }

  getSettingButtons(event: WorkspaceModelFactoryEvent<EntityPanelModel>): PanelToolbarButton[] {
    return event.model.presenterContext.getSettings().map((setting) => {
      const btn = event.model.presenterContext.settings.get(setting.key).control.representAsBtn();
      const isGroupBySetting = setting.key === EntityTreePresenterSetting.GROUP_BY;
      return {
        ...btn,
        label: isGroupBySetting ? 'Group by' : btn.label,
        enabled: false,
        tooltip: setting.label,
        icon: btn.icon || setting.icon
      };
    });
  }

  generateToolbar(event: WorkspaceModelFactoryEvent<EntityPanelModel>) {
    const describerContext = this.getDescriberSelectionContext(event);
    const presenterContext = this.getPresenterSelectionContext(event);

    let buttons = [
      this.getSelectAllButton(event),
      ...this.getSettingButtons(event),
      ...Array.from(event.model.presenterContext.toolbarButtons).map((btn) => btn.representAsBtn())
    ].filter((f) => !!f);

    if (describerContext || presenterContext || buttons.length > 0) {
      return (
        <PanelTitleToolbarWidget btns={buttons} context={[describerContext, presenterContext].filter((f) => !!f)} />
      );
    }
  }

  protected _generateModel(): EntityPanelModel<T> {
    return new EntityPanelModel(this);
  }

  protected generatePanelContent(event: WorkspaceModelFactoryEvent<EntityPanelModel<T>>): React.JSX.Element {
    return <EntityPanelWidget model={event.model} />;
  }
}
