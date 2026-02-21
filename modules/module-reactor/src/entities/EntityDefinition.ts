import { EntityComboBoxItem, EntitySearchEngineComponent } from './components/search/EntitySearchEngineComponent';
import { EncodedEntity, EntityEncoderComponent } from './components/encoder/EntityEncoderComponent';
import { EntityEncoderBank } from './components/encoder/EntityEncoderBank';
import { EntitySearchBank } from './components/search/EntitySearchBank';
import { EntityDefinitionComponent } from './EntityDefinitionComponent';
import { System } from '../core/System';
import { MousePosition } from '../layers/combo/SmartPositionWidget';
import { ReactorIcon } from '../widgets/icons/IconWidget';
import { EntityPresenterComponent } from './components/presenter/EntityPresenterComponent';
import { EntityHandlerComponent, OpenEntityEvent } from './components/handler/EntityHandlerComponent';
import { ComboBoxItem } from '../stores/combo/ComboBoxDirectives';
import { inject } from '../inversify.config';
import { EntityPanelComponent } from './components/ui/EntityPanelComponent';
import { EntityDescriberComponent, EntityDescription } from './components/meta/EntityDescriberComponent';
import { EntityDescriberBank } from './components/meta/EntityDescriberBank';
import { computed } from 'mobx';
import { EntityDocsComponent } from './components/meta/EntityDocsComponent';
import { ComponentBank } from './components/banks/ComponentBank';
import { ComboBoxStore2 } from '../stores/combo2/ComboBoxStore2';
import {
  SimpleComboBoxDirective,
  SimpleComboBoxDirectiveOptions
} from '../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { ComboBoxDirective } from '../stores/combo2/ComboBoxDirective';
import { Action } from '../actions/Action';
import { CoupledAction, CoupledActionEvent, CoupledActionFocusOption } from '../actions/parameterized/CoupledAction';
import { EntityAction } from '../actions/parameterized/EntityAction';
import {
  ParameterizedAction,
  ParameterizedActionEvent,
  ParameterizedActionOptions
} from '../actions/parameterized/ParameterizedAction';
import { ProviderActionParameter } from '../actions/parameterized/params/ProviderActionParameter';
import { DescendantEntityProviderComponent } from './components/exposer/DescendantEntityProviderComponent';
import { ThemeStore } from '../stores/themes/ThemeStore';
import { ActionStore } from '../stores/actions/ActionStore';

export interface EntityDefinitionOptions {
  type: string;
  label: string;
  category: string;
  icon: ReactorIcon;
  iconColor: string;
}

export interface EntityPickOptions<T extends any = any> {
  event?: MousePosition;
  filter?: (entity: T) => boolean;
  parent?: any;
  autoSelectedIsolatedEntity?: boolean;
}

export abstract class EntityDefinition<T extends any = any> {
  system: System;

  @inject(ComboBoxStore2)
  accessor comboBoxStore: ComboBoxStore2;

  @inject(ThemeStore)
  accessor themeStore: ThemeStore;

  @inject(ActionStore)
  accessor actionStore: ActionStore;

  private describers: EntityDescriberBank<T>;
  private docsComponents: ComponentBank<EntityDocsComponent<T>>;
  private encoders: EntityEncoderBank<T>;
  private searches: EntitySearchBank<T>;
  private presenterComponents: ComponentBank<EntityPresenterComponent>;
  private handlerComponents: ComponentBank<EntityHandlerComponent>;
  private panelComponents: ComponentBank<EntityPanelComponent>;
  private exposerComponents: ComponentBank<DescendantEntityProviderComponent<T, any>>;

  private additionalActionIds: string[];

  constructor(protected options: EntityDefinitionOptions) {
    this.describers = new EntityDescriberBank<T>(this);
    this.docsComponents = new ComponentBank<EntityDocsComponent<T>>();
    this.encoders = new EntityEncoderBank<T>({ type: this.options.type });
    this.searches = new EntitySearchBank<T>({ label: this.options.label });
    this.presenterComponents = new ComponentBank<EntityPresenterComponent>();
    this.handlerComponents = new ComponentBank<EntityHandlerComponent>();
    this.panelComponents = new ComponentBank<EntityPanelComponent>();
    this.exposerComponents = new ComponentBank<DescendantEntityProviderComponent<T, any>>();
    this.additionalActionIds = [];
  }

  setSystem(system: System) {
    this.system = system;
  }

  registerComponent(component: EntityDefinitionComponent) {
    component.setDefinition(this);
    if (component instanceof EntityDescriberComponent) {
      this.describers.register(component as EntityDescriberComponent<T>);
      return;
    }
    if (component instanceof EntityDocsComponent) {
      this.docsComponents.register(component as EntityDocsComponent<T>);
      return;
    }
    if (component instanceof EntityEncoderComponent) {
      this.encoders.register(component as EntityEncoderComponent<T>);
      return;
    }
    if (component instanceof EntitySearchEngineComponent) {
      this.searches.register(component as EntitySearchEngineComponent<T>);
      return;
    }
    if (component instanceof EntityPresenterComponent) {
      this.presenterComponents.register(component);
      return;
    }
    if (component instanceof EntityHandlerComponent) {
      this.handlerComponents.register(component);
      return;
    }
    if (component instanceof EntityPanelComponent) {
      this.panelComponents.register(component);
      return;
    }
    if (component instanceof DescendantEntityProviderComponent) {
      this.exposerComponents.register(component as DescendantEntityProviderComponent<T, any>);
      return;
    }
  }

  get category() {
    return this.options.category;
  }

  get type() {
    return this.options.type;
  }

  get label() {
    return this.options.label;
  }

  get icon() {
    return this.options.icon;
  }

  get iconColorDefault() {
    return this.options.iconColor;
  }

  @computed get iconColor() {
    return this.themeStore.getCurrentEntityTheme(this).iconColor;
  }

  abstract getEntityUID(t: T);

  abstract matchEntity(t: any): boolean;

  async resolveOneEntity(options: EntityPickOptions<T> = {}): Promise<T | null> {
    return this.searches.resolveOneEntity(options, this.comboBoxStore);
  }

  getComboBoxDirective(options: EntityPickOptions<T>): ComboBoxDirective<EntityComboBoxItem<T>> {
    return this.searches.getComboBoxDirective(options);
  }

  getAsComboBoxItem(t: T): EntityComboBoxItem<T> {
    const described = this.describeEntity(t);
    return {
      key: this.getEntityUID(t),
      entity: t,
      title: described.simpleName,
      icon: described.icon,
      color: described.iconColor
    };
  }

  describeEntity(t: T): EntityDescription {
    const preferred = this.getPreferredDescriber();
    if (preferred) {
      return preferred.describeEntity(t);
    }
    console.warn(`No describer found for entity of type [${this.type}], falling back to default`);
    return {
      icon: this.icon,
      simpleName: this.getEntityUID(t)
    };
  }

  showContextMenuForEntity(
    entity: T,
    event: MousePosition,
    options: Pick<SimpleComboBoxDirectiveOptions, 'hideSearch'> = {}
  ) {
    let items: ComboBoxItem[] = [];

    // actions
    for (let docComponent of this.getDocumenters()) {
      let docs = docComponent.getDocs(entity);
      if (docs) {
        items.push({
          key: `docs-${docComponent.label}`,
          title: docComponent.label,
          group: 'Docs',
          icon: 'external-link',
          color: 'cyan',
          action: async () => {
            window.open(docs, '_blank');
          }
        });
      }
    }

    // actions
    items = [
      ...items,
      ...this.getActionsForEntity(entity)
        .map((a) => {
          const item = a.representAsComboBoxItem({
            installAction: true,
            eventData: this.getActionEventDataForEntity(entity, a)
          });

          if (!item) {
            return null;
          }

          return {
            ...item,
            group: item.group || 'General actions'
          };
        })
        .filter((i) => !!i)
    ];

    const described = this.describeEntity(entity);
    this.comboBoxStore.show(
      new SimpleComboBoxDirective({
        title: described.simpleName,
        subtitle: this.label,
        items,
        event,
        ...options
      })
    );
  }

  getActionEventDataForEntity(entity: T, a: Action) {
    if (a instanceof CoupledAction) {
      /**
       * If the action is coupled, we need to determine which focus the given entity is.
       * The action could have been triggered from either the source or target entity.
       */
      const entityActionFocus =
        a.options.target == a.options.source || this.type == a.options.source
          ? CoupledActionFocusOption.SOURCE
          : CoupledActionFocusOption.TARGET;
      return {
        [entityActionFocus]: entity
      } as Record<CoupledActionFocusOption, T> as CoupledActionEvent;
    }
    if (a instanceof ParameterizedAction) {
      const matchingParameter = (a.options as ParameterizedActionOptions).params?.find(
        (p) => p instanceof ProviderActionParameter && p.options.type == this.type
      );
      if (matchingParameter) {
        return {
          entities: { [matchingParameter.options.name]: entity }
        } as ParameterizedActionEvent;
      }
    }
    if (a instanceof EntityAction) {
      return {
        targetEntity: entity
      } as CoupledActionEvent;
    }
    return {};
  }

  isActionAllowedForEntity(action: Action, entity: T) {
    return true;
  }

  getActionsForEntity(entity: T): Action[] {
    return [
      ...this.actionStore.getActionsForEntityDecoded({
        type: this.type,
        entity: entity
      }),
      ...this.additionalActionIds.map((id) => this.actionStore.getActionByID(id))
    ].filter((a) => this.isActionAllowedForEntity(a, entity));
  }

  getPreferredDescriber() {
    return this.describers.getPreferred();
  }

  getSettings() {
    return this.describers.getSettings();
  }

  registerAdditionalAction(actionId: string) {
    this.additionalActionIds.push(actionId);
  }

  getDocumenters(): EntityDocsComponent<T>[] {
    return this.docsComponents.getItems();
  }

  getDescribers() {
    return this.describers.getItems();
  }

  getEncoders(): EntityEncoderComponent<T>[] {
    return this.encoders.getItems();
  }

  getSearchEngines(): EntitySearchEngineComponent<T>[] {
    return this.searches.getItems();
  }

  getPresenters(): EntityPresenterComponent[] {
    return this.presenterComponents.getItems();
  }

  getHandlers(): EntityHandlerComponent[] {
    return this.handlerComponents.getItems();
  }

  getPanelComponents(): EntityPanelComponent[] {
    return this.panelComponents.getItems();
  }

  getExposers(): DescendantEntityProviderComponent<T, any>[] {
    return this.exposerComponents.getItems();
  }

  // !-------------- handling ---------------

  async selectEntity(event: OpenEntityEvent<T>) {
    const handlers = this.getHandlers();
    if (handlers.length === 0) {
      return;
    }
    if (handlers.length === 1) {
      return handlers[0].openEntity(event);
    }

    await this.comboBoxStore.show(
      new SimpleComboBoxDirective({
        event: event.position,
        items: handlers.map((h) => {
          return {
            ...h.getDescription(event.entity),
            key: h.uuid,
            action: async () => {
              return h.openEntity(event);
            }
          } as ComboBoxItem;
        })
      })
    );
  }

  isMultiSelectable() {
    return this.getEncoders().length > 0;
  }

  // !-------------- encoding ---------------

  getEncoder(version?: number): EntityEncoderComponent<T> {
    return this.encoders.getEncoder(version);
  }

  encode(entity: T, throws = true): EncodedEntity {
    return this.encoders.encode(entity, throws);
  }

  decode(entity: EncodedEntity): Promise<T> {
    return this.encoders.decode(entity);
  }
}
