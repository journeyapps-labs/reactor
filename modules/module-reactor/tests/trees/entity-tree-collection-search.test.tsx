import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ReactorTreeNode } from '../../src/widgets/core-tree/reactor-tree/ReactorTreeNode';
import { SearchableTreeSearchScope } from '../../src/widgets/core-tree/SearchableTreeSearchScope';
import { EntityTreeCollectionWidget } from '../../src/entities/components/presenter/types/tree/EntityTreeCollectionWidget';
import { renderWithReactorTestRig } from '../rig/reactor-test-rig';

const searchableEntityTreeWidgetSpy = vi.fn();

vi.mock('../../src/entities/components/presenter/types/tree/SearchableEntityTreeWidget', () => {
  return {
    SearchableEntityTreeWidget: (props: any) => {
      searchableEntityTreeWidgetSpy(props);
      return <div data-testid="searchable-entity-tree-widget" />;
    }
  };
});

vi.mock('../../src/entities/components/presenter/types/tree/EntityReactorNode', async () => {
  const { ReactorTreeNode } = await import('../../src/widgets/core-tree/reactor-tree/ReactorTreeNode');
  class MockEntityReactorNode extends ReactorTreeNode {}
  return {
    EntityReactorNode: MockEntityReactorNode
  };
});

vi.mock('../../src/entities/components/presenter/types/tree/EntityReactorLeaf', async () => {
  const { ReactorTreeLeaf } = await import('../../src/widgets/core-tree/reactor-tree/ReactorTreeLeaf');
  class MockEntityReactorLeaf extends ReactorTreeLeaf {}
  return {
    EntityReactorLeaf: MockEntityReactorLeaf
  };
});

const createRootNode = (key: string) => {
  return new ReactorTreeNode({
    key,
    match: (event) => event.matches(key)
  });
};

describe('EntityTreeCollectionWidget search integration', () => {
  it('routes search mode through SearchableEntityTreeWidget and forwards presenter search scope', async () => {
    searchableEntityTreeWidgetSpy.mockClear();

    const alpha = createRootNode('Alpha');
    const bravo = createRootNode('Bravo');
    const presenterContext = {
      presenter: {
        searchScope: SearchableTreeSearchScope.VISIBLE_ONLY
      },
      getTreeNodes: () => [alpha, bravo],
      saveState: vi.fn()
    } as any;

    const event = {
      searchEvent: {
        search: 'alp'
      }
    } as any;

    const rig = await renderWithReactorTestRig(
      <EntityTreeCollectionWidget event={event} presenterContext={presenterContext} />
    );

    expect(searchableEntityTreeWidgetSpy).toHaveBeenCalledTimes(1);
    expect(searchableEntityTreeWidgetSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        nodes: [alpha, bravo],
        search: 'alp',
        searchScope: SearchableTreeSearchScope.VISIBLE_ONLY
      })
    );

    await rig.unmount();
  });

  it('renders CoreTreeWidget collection when search is not active', async () => {
    searchableEntityTreeWidgetSpy.mockClear();

    const alpha = createRootNode('Alpha');
    const bravo = createRootNode('Bravo');
    const presenterContext = {
      presenter: {
        searchScope: SearchableTreeSearchScope.FULL_TREE
      },
      getTreeNodes: () => [alpha, bravo],
      saveState: vi.fn()
    } as any;

    const event = {
      searchEvent: {
        search: ''
      }
    } as any;

    const rig = await renderWithReactorTestRig(
      <EntityTreeCollectionWidget event={event} presenterContext={presenterContext} />
    );

    expect(searchableEntityTreeWidgetSpy).not.toHaveBeenCalled();
    expect(rig.container.textContent).toContain('Alpha');
    expect(rig.container.textContent).toContain('Bravo');

    await rig.unmount();
  });
});
