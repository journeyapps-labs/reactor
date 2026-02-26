import { ReactorTreeNode } from '../../../widgets/core-tree/reactor-tree/ReactorTreeNode';
import { TreeBadgeWidget } from '../../../widgets/tree/TreeBadgeWidget';
import {
  DescendantEntityGeneratedOptions,
  DescendantEntityProviderComponent,
  DescendantEntityProviderComponentOptions
} from './DescendantEntityProviderComponent';
import { inject } from '../../../inversify.config';
import { NotificationStore, NotificationType } from '../../../stores/NotificationStore';
import { ThemeStore } from '../../../stores/themes/ThemeStore';
import * as React from 'react';

export interface DescendantLoadingEntityGeneratedOptions<
  Descendant
> extends DescendantEntityGeneratedOptions<Descendant> {
  refreshDescendants?: (event: { node?: ReactorTreeNode }) => Promise<any>;
  loading?: () => boolean;
}

export interface DescendantLoadingEntityProviderOptions<
  Parent,
  Descendant
> extends DescendantEntityProviderComponentOptions<Parent, Descendant> {
  generateOptions: (parentEntity: Parent) => DescendantLoadingEntityGeneratedOptions<Descendant> | null;
}

export class DescendantLoadingEntityProviderComponent<Parent, Descendant> extends DescendantEntityProviderComponent<
  Parent,
  Descendant
> {
  @inject(NotificationStore)
  accessor notificationStore: NotificationStore;
  @inject(ThemeStore)
  accessor themeStore: ThemeStore;

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
    let loading = false;
    let clearErrorBadge: () => any = null;
    let errorMessage: string = null;

    const dismissErrorBadge = () => {
      clearErrorBadge?.();
      clearErrorBadge = null;
      errorMessage = null;
    };

    const showErrorBadge = (error: unknown) => {
      dismissErrorBadge();
      errorMessage = error instanceof Error ? error.message : `${error || 'Unknown error'}`;
      clearErrorBadge = node.addPropGenerator(() => {
        const currentTheme = this.themeStore.getCurrentTheme();
        return {
          rightChildren: (
            <TreeBadgeWidget
              icon="exclamation-triangle"
              background={currentTheme.status.failed}
              iconColor={currentTheme.status.failedForeground}
              tooltip="Refresh failed. Click to view error."
              action={() => {
                this.notificationStore.showNotification({
                  title: 'Failed to refresh descendants',
                  description: errorMessage,
                  type: NotificationType.ERROR
                });
                dismissErrorBadge();
              }}
            />
          )
        };
      });
    };

    const check = async () => {
      // we only want to run 1 at a time
      if (loading) {
        return;
      }
      if (!node.collapsed && node.visible && node.attached) {
        let gen: () => any;
        try {
          loading = true;
          // show loading while refreshing descendents
          gen = node.addPropGenerator(() => {
            return {
              loading: true
            };
          });
          await descendantOptions.refreshDescendants?.({
            node
          });
        } catch (error) {
          showErrorBadge(error);
        } finally {
          loading = false;
          gen?.();
        }
      }
    };
    const listener = node.registerListener({
      collapsedChanged: () => {
        check();
      },
      visibilityChanged: () => {
        check();
      }
    });
    return () => {
      listener?.();
      dismissErrorBadge();
    };
  }

  generateTreeNode(
    descendantOptions: DescendantLoadingEntityGeneratedOptions<Descendant> & { parent: Parent }
  ): ReactorTreeNode {
    const node = super.generateTreeNode(descendantOptions);
    this.installNode(node, descendantOptions);
    return node;
  }
}
