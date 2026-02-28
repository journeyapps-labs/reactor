import React from 'react';
import {
  GroupingOptionValue,
  GroupBySettingOptions,
  RenderCollectionOptions,
  AbstractPresenterContext
} from '../../AbstractPresenterContext';
import { EntityPresenterComponent, EntityPresenterComponentRenderType } from '../../EntityPresenterComponent';
import { BatchStore } from '../../../../../stores/batch/BatchStore';
import { inject } from '../../../../../inversify.config';
import { ActionSource } from '../../../../../actions/Action';
import { MousePosition } from '../../../../../layers/combo/SmartPositionWidget';
import { EntityCardsCollectionWidget } from './EntityCardsCollectionWidget';
import { DescendantEntityProviderComponent } from '../../../exposer/DescendantEntityProviderComponent';
import { EntityTreePresenterComponent } from '../tree/EntityTreePresenterComponent';
import { AbstractEntityTreePresenterContext } from '../tree/presenter-contexts/AbstractEntityTreePresenterContext';
import { BooleanControl } from '../../../../../controls/BooleanControl';

export interface EntityCardsPresenterComponentOptions {
  label?: string;
  allowedGroupingSettings?: {
    complexName?: boolean;
    tags?: boolean;
  };
  defaultGroupingSetting?: GroupingOptionValue;
}

export enum EntityCardsPresenterSetting {
  SHOW_NESTED = 'show-nested',
  GROUP_BY = 'groupBy'
}

export interface EntityCardsPresenterSettings {
  [EntityCardsPresenterSetting.SHOW_NESTED]: boolean;
  [EntityCardsPresenterSetting.GROUP_BY]?: GroupingOptionValue;
}

export interface NestedTreeRenderOption {
  key: string;
  label: string;
  entities: any[];
  context: AbstractEntityTreePresenterContext;
}

export class EntityCardsPresenterContext<T> extends AbstractPresenterContext<T, {}, EntityCardsPresenterSettings> {
  @inject(BatchStore)
  accessor batchStore: BatchStore;
  protected nestedTreeContexts: Map<DescendantEntityProviderComponent<any, any>, AbstractEntityTreePresenterContext>;

  constructor(public presenter: EntityCardsPresenterComponent<T>) {
    const groupBySetting: GroupBySettingOptions = {
      allowedGroupingSettings: presenter.options2.allowedGroupingSettings || {
        complexName: true,
        tags: true
      },
      defaultGroupingSetting: presenter.options2.defaultGroupingSetting
    };
    super(presenter, {
      groupBySetting
    });
    this.nestedTreeContexts = new Map();

    this.addSetting({
      icon: 'sitemap',
      label: 'Show nested',
      key: EntityCardsPresenterSetting.SHOW_NESTED,
      control: new BooleanControl({
        initialValue: true
      })
    });
  }

  get definition() {
    return this.presenter.definition;
  }

  getRenderableEntities(event: RenderCollectionOptions<T>): T[] {
    const entities = event.entities || [];
    if (!event.searchEvent?.search) {
      return entities;
    }

    return entities.filter((entity) => {
      const described = this.definition.describeEntity(entity);
      return !!event.searchEvent.matches(described.simpleName, { nullIsTrue: false });
    });
  }

  getNestedTreeRenderOptions(entity: T): NestedTreeRenderOption[] {
    const settings = this.getControlValues();
    if (!settings[EntityCardsPresenterSetting.SHOW_NESTED]) {
      return [];
    }

    return this.definition.getExposers().flatMap((exposer, index) => {
      const descendantDefinition = this.definition.system.getDefinition(exposer.descendantType);
      if (!descendantDefinition) {
        return [];
      }

      const presenter = descendantDefinition
        .getPresenters()
        .find((p) => p instanceof EntityTreePresenterComponent) as EntityTreePresenterComponent<any>;
      if (!presenter) {
        return [];
      }

      if (!this.nestedTreeContexts.has(exposer)) {
        this.nestedTreeContexts.set(exposer, presenter.generateContext());
      }

      const context = this.nestedTreeContexts.get(exposer);
      const options = exposer.getDescendantOptions(entity);
      const descendants = options?.descendants || [];
      if (descendants.length === 0) {
        return [];
      }

      return [
        {
          key: `nested-${exposer.descendantType}-${index}`,
          label: options?.category?.label || descendantDefinition.label,
          entities: descendants,
          context
        }
      ];
    });
  }

  handleClick(entity: T, position: MousePosition, source: ActionSource) {
    const encoded = this.definition.encode(entity, false);
    if (encoded && this.definition.isMultiSelectable()) {
      if ((position as any).shiftKey) {
        this.batchStore.select(encoded);
      } else {
        this.batchStore.selectOne(encoded);
      }
    }

    this.definition.selectEntity({
      entity,
      position,
      source
    });
  }

  handleContextMenu(entity: T, event: MousePosition) {
    if (this.batchStore.selections.length > 1) {
      this.batchStore.showContextMenu(event);
      return;
    }
    this.definition.showContextMenuForEntity(entity, event);
  }

  renderCollection(event: RenderCollectionOptions<T>): React.JSX.Element {
    return <EntityCardsCollectionWidget event={event} presenterContext={this} />;
  }

  render(entity: T): React.JSX.Element {
    return (
      <EntityCardsCollectionWidget
        presenterContext={this}
        event={{
          entities: [entity]
        }}
      />
    );
  }

  dispose() {
    this.nestedTreeContexts.forEach((context) => {
      context.dispose();
    });
    this.nestedTreeContexts.clear();
    super.dispose();
  }
}

export class EntityCardsPresenterComponent<T> extends EntityPresenterComponent<T, EntityCardsPresenterContext<T>> {
  static DEFAULT_LABEL = 'Cards view';

  constructor(public readonly options2: EntityCardsPresenterComponentOptions = {}) {
    super(EntityPresenterComponentRenderType.CARDS, {
      label: options2.label || EntityCardsPresenterComponent.DEFAULT_LABEL
    });
  }

  protected _generateContext(): EntityCardsPresenterContext<T> {
    return new EntityCardsPresenterContext<T>(this);
  }
}
