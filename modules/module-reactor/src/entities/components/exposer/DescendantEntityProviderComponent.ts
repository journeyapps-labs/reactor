import { EntityDefinitionComponent } from '../../EntityDefinitionComponent';
import { ReactorTreeNode } from '../../../widgets/core-tree/reactor-tree/ReactorTreeNode';
import { ReactorTreeEntity } from '../../../widgets/core-tree/reactor-tree/reactor-tree-utils';
import { TreeWidgetProps } from '../../../widgets/tree/TreeWidget';
import { inject } from '../../../inversify.config';
import { ComboBoxStore2 } from '../../../stores/combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { AbstractEntityTreePresenterContext } from '../presenter/types/tree/presenter-contexts/AbstractEntityTreePresenterContext';
import { Action, EntityAction } from '../../../actions';

export type CategoryInfo = Omit<TreeWidgetProps, 'forwardRef' | 'children' | 'rightClick'> & { sortKey?: string };

export interface DescendantEntityGeneratedOptions<Descendant> {
  category?: CategoryInfo;
  descendants: Descendant[];
}

export interface DescendantEntityProviderComponentOptions<Parent, Descendant> {
  descendantType: string;
  generateOptions: (parentEntity: Parent) => DescendantEntityGeneratedOptions<Descendant> | null;
}

export interface DoGetReactorTreeEntitiesOptions<Parent, Descendant> {
  descendantOptions: DescendantEntityGeneratedOptions<Descendant>;
  entity: Parent;
  context: AbstractEntityTreePresenterContext<Descendant>;
}

export class DescendantEntityProviderComponent<Parent = any, Descendant = any> extends EntityDefinitionComponent {
  static TYPE = 'descendant-entity-provider';

  @inject(ComboBoxStore2)
  accessor comboBoxStore: ComboBoxStore2;

  cache: Map<AbstractEntityTreePresenterContext<Descendant>, ReactorTreeNode>;

  constructor(protected options: DescendantEntityProviderComponentOptions<Parent, Descendant>) {
    super(DescendantEntityProviderComponent.TYPE);
    this.cache = new Map();
  }

  get descendantType() {
    return this.options.descendantType;
  }

  installParentNode(parent: ReactorTreeNode, descendantOptions: DescendantEntityGeneratedOptions<Descendant>) {
    return () => {};
  }

  generateTreeNode(descendantOptions: DescendantEntityGeneratedOptions<Descendant> & { parent: Parent }) {
    const categoryInfo = descendantOptions.category;
    const node = new ReactorTreeNode({
      key: categoryInfo.label,
      getTreeProps: () => {
        return {
          ...categoryInfo,
          rightClick: (e) => {
            const actions = this.system
              .getActions()
              .filter((a) => {
                if (a.options.category?.entityType === this.options.descendantType) {
                  if (a instanceof EntityAction) {
                    return a.options.target === this.definition.type;
                  }
                  return true;
                }
                return false;
              })
              .map((a: Action | EntityAction) => {
                if (a instanceof EntityAction) {
                  return a.representAsComboBoxItem({
                    installAction: true,
                    eventData: { targetEntity: descendantOptions.parent }
                  });
                }
                return a.representAsComboBoxItem({
                  installAction: true
                });
              })
              .filter((a) => a!!);
            this.comboBoxStore.show(
              new SimpleComboBoxDirective({
                items: actions,
                event: e
              })
            );
          }
        };
      }
    });
    if (descendantOptions.category.openDefault != null) {
      node.setCollapsed(!descendantOptions.category.openDefault);
    }
    node.setSortKey(categoryInfo.sortKey || categoryInfo.label);
    return node;
  }

  protected doGetReactorTreeEntities(options: DoGetReactorTreeEntitiesOptions<Parent, Descendant>) {
    const { entity, descendantOptions, context } = options;
    if (descendantOptions == null) {
      return []; // Don't even show category
    }

    const childEntities = descendantOptions.descendants;
    const categoryInfo = descendantOptions.category;
    const children = context.getTreeNodes({
      entities: childEntities
    });

    if (!categoryInfo?.label) {
      return children;
    }

    if (!this.cache.has(context)) {
      let l1 = context.registerListener({
        disposed: () => {
          this.cache.delete(context);
          l1();
        }
      });
      this.cache.set(
        context,
        this.generateTreeNode({
          ...descendantOptions,
          parent: entity
        })
      );
    }

    const node = this.cache.get(context);
    node.setChildren([]);
    children.forEach((c) => {
      node.addChild(c);
    });
    return [node];
  }

  getReactorTreeEntities(
    entity: Parent,
    context: AbstractEntityTreePresenterContext<Descendant>
  ): { entities: ReactorTreeEntity[]; options: DescendantEntityGeneratedOptions<Descendant> } {
    const descendantOptions = this.options.generateOptions(entity);
    return {
      options: descendantOptions,
      entities: this.doGetReactorTreeEntities({
        entity,
        descendantOptions,
        context
      })
    };
  }
}
