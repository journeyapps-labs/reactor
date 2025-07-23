import { EntityTreePresenterComponent } from '../../entities/components/presenter/types/tree/EntityTreePresenterComponent';
import { Action, ParameterizedAction } from '../../actions';
import { EntityTreePresenterContext } from '../../entities/components/presenter/types/tree/presenter-contexts/EntityTreePresenterContext';
import { ReactorTreeEntity, ReactorTreeLeaf, ReactorTreeNode } from '../../widgets';

export class ActionTreePresenterContext extends EntityTreePresenterContext<Action> {
  doGenerateTreeNode(entity: Action, options): ReactorTreeEntity {
    if (!(entity instanceof ParameterizedAction)) {
      return new ReactorTreeLeaf({
        key: entity.id,
        getTreeProps: () => {
          return options;
        },
        match: (event) => {
          return event.matches(entity.options.name);
        }
      });
    }
    let node = new ReactorTreeNode({
      key: entity.id,
      getTreeProps: () => {
        return options;
      },
      match: (event) => {
        return event.matches(entity.options.name);
      }
    });
    for (let param of (entity as ParameterizedAction).options.params) {
      node.addChild(
        new ReactorTreeLeaf({
          key: param.options.name,
          getTreeProps: () => {
            return {
              icon: 'circle',
              label: param.options.name
            };
          }
        })
      );
    }

    return node;
  }
}

export class ActionTreePresenter extends EntityTreePresenterComponent<Action> {
  constructor() {
    super({
      label: 'Advanced Tree'
    });
  }

  protected _generateContext() {
    return new ActionTreePresenterContext(this);
  }
}
