import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ReactorTreeLeaf, ReactorTreeNode, SearchableCoreTreeWidget, SearchableTreeSearchScope } from '../../src/';
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

    const rig = await renderWithReactorTestRig(
      <SearchableCoreTreeWidget tree={root} search="ace" searchScope={SearchableTreeSearchScope.FULL_TREE} />
    );

    await rig.flush(20);

    expect(root.collapsed).toBe(false);
    expect(nestedGroup.collapsed).toBe(false);

    await rig.unmount();
  });

  it('does not open collapsed matching branches in VISIBLE_ONLY scope', async () => {
    const visibleAce = createLeaf('Ace');
    const nestedAce = createLeaf('Nested Ace');
    const nestedGroup = createNode('group', [nestedAce]);
    const root = createNode('root', [visibleAce, nestedGroup]);
    root.open({ reveal: false });

    const rig = await renderWithReactorTestRig(
      <SearchableCoreTreeWidget tree={root} search="ace" searchScope={SearchableTreeSearchScope.VISIBLE_ONLY} />
    );

    await rig.flush(20);

    expect(nestedGroup.collapsed).toBe(true);
    await rig.unmount();
  });
});
