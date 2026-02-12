import { ReactorTreeEntity } from '../../../../../../widgets';
import { RenderCollectionOptions } from '../../../AbstractPresenterContext';
import { EntityTreePresenterComponent, EntityTreePresenterSettings } from '../EntityTreePresenterComponent';
import { observable } from 'mobx';
import { AbstractEntityTreePresenterContext } from './AbstractEntityTreePresenterContext';

export abstract class CachedEntityTreePresenterContext<
  T extends any = any,
  Settings extends EntityTreePresenterSettings = EntityTreePresenterSettings
> extends AbstractEntityTreePresenterContext<T, Settings> {
  @observable
  accessor cachedNodes: Map<T, ReactorTreeEntity>;

  constructor(presenter: EntityTreePresenterComponent<T>) {
    super(presenter);
    this.cachedNodes = new Map();
  }

  protected doGetTreeNodes(event: RenderCollectionOptions<T>): ReactorTreeEntity[] {
    // remove old nodes
    Array.from(this.cachedNodes.keys()).forEach((k) => {
      if (!event.entities.includes(k)) {
        this.cachedNodes.delete(k);
      }
    });

    // convert entities into nodes
    return event.entities.map((e) => {
      if (!this.cachedNodes.has(e)) {
        const node = this.generateTreeNode(e, {
          events: event.events
        });

        this.cachedNodes.set(e, node);

        this.iterateListeners((cb) => cb.treeGenerated?.({ entity: e, tree: node }));
      }
      return this.cachedNodes.get(e);
    });
  }
}
