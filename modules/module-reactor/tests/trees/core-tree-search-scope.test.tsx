import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ReactorTreeLeaf } from '../../src/widgets/core-tree/reactor-tree/ReactorTreeLeaf';
import { ReactorTreeNode } from '../../src/widgets/core-tree/reactor-tree/ReactorTreeNode';
import { SearchableCoreTreeWidget } from '../../src/widgets/core-tree/SearchableCoreTreeWidget';
import { SearchableTreeSearchScope } from '../../src/widgets/core-tree/SearchableTreeSearchScope';
import { renderWithReactorTestRig } from '../rig/reactor-test-rig';

const createLeaf = (key: string) => {
  return new ReactorTreeLeaf({
    key,
    match: (event) => event.matches(key)
  });
};

const createNode = (key: string, children: Array<ReactorTreeNode | ReactorTreeLeaf> = []) => {
  const node = new ReactorTreeNode({
    key,
    match: (event) => event.matches(key)
  });
  children.forEach((child) => {
    node.addChild(child);
  });
  return node;
};

describe('SearchableCoreTreeWidget search scope', () => {
  it('opens collapsed matching branches in FULL_TREE scope', async () => {
    const nestedAce = createLeaf('Ace');
    const nestedGroup = createNode('group', [nestedAce]);
    const root = createNode('root', [nestedGroup]);
    const onSearchResultChanged = vi.fn();

    const rig = await renderWithReactorTestRig(
      <SearchableCoreTreeWidget
        tree={root}
        search="ace"
        searchScope={SearchableTreeSearchScope.FULL_TREE}
        onSearchResultChanged={onSearchResultChanged}
      />
    );

    await rig.flush(20);

    expect(root.collapsed).toBe(false);
    expect(nestedGroup.collapsed).toBe(false);
    expect(onSearchResultChanged).toHaveBeenCalled();

    await rig.unmount();
  });

  it('does not open collapsed matching branches in VISIBLE_ONLY scope', async () => {
    const visibleAce = createLeaf('Ace');
    const nestedAce = createLeaf('Nested Ace');
    const nestedGroup = createNode('group', [nestedAce]);
    const root = createNode('root', [visibleAce, nestedGroup]);
    root.open({ reveal: false });
    const onSearchResultChanged = vi.fn();

    const rig = await renderWithReactorTestRig(
      <SearchableCoreTreeWidget
        tree={root}
        search="ace"
        searchScope={SearchableTreeSearchScope.VISIBLE_ONLY}
        onSearchResultChanged={onSearchResultChanged}
      />
    );

    await rig.flush(20);

    expect(nestedGroup.collapsed).toBe(true);

    const calls = onSearchResultChanged.mock.calls;
    const latest = calls[calls.length - 1]?.[0]?.matched ?? [];
    expect(latest).toContain(visibleAce);
    expect(latest).not.toContain(nestedAce);

    await rig.unmount();
  });
});
