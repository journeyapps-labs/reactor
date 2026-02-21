import { ReactorTreeEntity } from '../../../../../../widgets/core-tree/reactor-tree/reactor-tree-utils';
import { RenderCollectionOptions } from '../../../AbstractPresenterContext';
import { EntityTreePresenterSettings } from '../EntityTreePresenterComponent';
import { AbstractEntityTreePresenterContext } from './AbstractEntityTreePresenterContext';

export abstract class EntityTreePresenterContext<
  T extends any = any,
  Settings extends EntityTreePresenterSettings = EntityTreePresenterSettings
> extends AbstractEntityTreePresenterContext<T, Settings> {
  protected doGetTreeNodes(event: RenderCollectionOptions<T>): ReactorTreeEntity[] {
    // convert entities into nodes
    return event.entities.map((e) => {
      const node = this.generateTreeNode(e, {
        events: event.events
      });
      this.iterateListeners((cb) => cb.treeGenerated?.({ entity: e, tree: node }));
      return node;
    });
  }
}
