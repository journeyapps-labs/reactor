import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ReactorTreeNode } from '../../src/widgets/core-tree/reactor-tree/ReactorTreeNode';
import { SearchableTreeSearchScope } from '../../src/widgets/core-tree/SearchableTreeSearchScope';
import { EntityTreeCollectionWidget } from '../../src/entities/components/presenter/types/tree/EntityTreeCollectionWidget';
import { renderWithReactorTestRig } from '../rig/reactor-test-rig';

const createRootNode = (key: string) => {
  return new ReactorTreeNode({
    key,
    match: (event) => event.matches(key)
  });
};

describe('EntityTreeCollectionWidget search integration', () => {
  it('routes search mode through SearchableEntityTreeWidget and forwards presenter search scope', async () => {
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

    expect(rig.container.textContent).toContain('Alpha');
    expect(rig.container.textContent).not.toContain('No search results');

    await rig.unmount();
  });

  it('renders CoreTreeWidget collection when search is not active', async () => {
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

    expect(rig.container.textContent).toContain('Alpha');
    expect(rig.container.textContent).toContain('Bravo');

    await rig.unmount();
  });
});
