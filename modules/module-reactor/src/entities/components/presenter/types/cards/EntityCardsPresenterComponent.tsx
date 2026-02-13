import React from 'react';
import { RenderCollectionOptions, AbstractPresenterContext } from '../../AbstractPresenterContext';
import { EntityPresenterComponent, EntityPresenterComponentRenderType } from '../../EntityPresenterComponent';
import { BatchStore } from '../../../../../stores/batch/BatchStore';
import { inject } from '../../../../../inversify.config';
import { ActionSource } from '../../../../../actions';
import { MousePosition } from '../../../../../layers/combo/SmartPositionWidget';
import { EntityCardsCollectionWidget } from './EntityCardsCollectionWidget';

export interface EntityCardsPresenterComponentOptions {
  label?: string;
}

export class EntityCardsPresenterContext<T> extends AbstractPresenterContext<T> {
  @inject(BatchStore)
  accessor batchStore: BatchStore;

  constructor(public presenter: EntityCardsPresenterComponent<T>) {
    super(presenter);
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
      const labelTerms = (described.labels || []).flatMap((label) => [label.label, label.value]);
      return [described.simpleName, described.complexName, ...labelTerms, ...(described.tags || [])]
        .filter((v) => v != null && `${v}`.trim() !== '')
        .some((value) => !!event.searchEvent.matches(String(value), { nullIsTrue: false }));
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
}

export class EntityCardsPresenterComponent<T> extends EntityPresenterComponent<T, EntityCardsPresenterContext<T>> {
  static DEFAULT_LABEL = 'Cards view';

  constructor(protected options2: EntityCardsPresenterComponentOptions = {}) {
    super(EntityPresenterComponentRenderType.CARDS, {
      label: options2.label || EntityCardsPresenterComponent.DEFAULT_LABEL
    });
  }

  protected _generateContext(): EntityCardsPresenterContext<T> {
    return new EntityCardsPresenterContext<T>(this);
  }
}
