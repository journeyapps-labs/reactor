import { ReactorTreeNode } from '../../../widgets/core-tree/reactor-tree/ReactorTreeNode';
import {
  DescendantEntityGeneratedOptions,
  DescendantEntityProviderComponent,
  DescendantEntityProviderComponentOptions
} from './DescendantEntityProviderComponent';

export interface DescendantLoadingEntityGeneratedOptions<Descendant>
  extends DescendantEntityGeneratedOptions<Descendant> {
  refreshDescendants?: (event: { node?: ReactorTreeNode }) => any;
  loading?: () => boolean;
}

export interface DescendantLoadingEntityProviderOptions<Parent, Descendant>
  extends DescendantEntityProviderComponentOptions<Parent, Descendant> {
  generateOptions: (parentEntity: Parent) => DescendantLoadingEntityGeneratedOptions<Descendant> | null;
}

export class DescendantLoadingEntityProviderComponent<Parent, Descendant> extends DescendantEntityProviderComponent<
  Parent,
  Descendant
> {
  constructor(protected options: DescendantLoadingEntityProviderOptions<Parent, Descendant>) {
    super(options);
  }

  installParentNode(parent: ReactorTreeNode, descendantOptions: DescendantEntityGeneratedOptions<Descendant>) {
    let l1 = super.installParentNode(parent, descendantOptions);
    let l2: () => any;
    // if there IS a category, its handled in the generateTreeNode below, otherwise we handle it here
    if (!descendantOptions.category) {
      l2 = this.installNode(parent, descendantOptions);
    }
    return () => {
      l1?.();
      l2?.();
    };
  }

  installNode(node: ReactorTreeNode, descendantOptions: DescendantLoadingEntityGeneratedOptions<Descendant>) {
    const check = () => {
      if (!node.collapsed && node.visible && node.attached) {
        descendantOptions.refreshDescendants?.({
          node
        });
      }
    };
    return node.registerListener({
      collapsedChanged: () => {
        check();
      },
      attachedChanged: () => {
        check();
      },
      visibilityChanged: () => {
        check();
      }
    });
  }

  generateTreeNode(
    descendantOptions: DescendantLoadingEntityGeneratedOptions<Descendant> & { parent: Parent }
  ): ReactorTreeNode {
    const node = super.generateTreeNode(descendantOptions);
    this.installNode(node, descendantOptions);
    return node;
  }
}
