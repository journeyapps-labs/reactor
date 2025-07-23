import { TreeEntity, TreeNode } from '../../src';
import { describe, it, expect } from 'vitest';

describe('Tree', () => {
  it('should test all tree things', async () => {
    const root = new TreeNode('root');
    const child1 = new TreeNode('child1');
    const child2 = new TreeNode('child2');
    const child3 = new TreeEntity('child3');

    root.addChild(child1);
    child1.addChild(child2);
    root.addChild(child3);

    // check parents
    expect(child1.getParent()).toBe(root);
    expect(root.flatten().length).toEqual(4);
    expect(root.getChild('child1')).toBe(child1);
    expect(child1.getChild('child2')).toBe(child2);
    await expect(() => {
      root.addChild(new TreeNode('child1'));
    }).toThrow();

    // deep fetch
    expect(root.fromPath(child1.getPath())).toBe(child1);
    expect(root.fromPath(child2.getPath())).toBe(child2);
    expect(root.fromPath(child3.getPath())).toBe(child3);

    // deleting
    child3.delete();
    expect(child3.getParent()).toEqual(null);
    expect(root.flatten().length).toEqual(3);
    root.addChild(child3);

    // serialization
    const serialized = root.serialize();
    expect(serialized).toMatchSnapshot();
    expect(root.collapsed).toEqual(true);
    expect(child1.collapsed).toEqual(true);
    expect(child2.collapsed).toEqual(true);

    const promises = [root, child1, child2].map((c: TreeNode) => {
      return new Promise((resolve) => {
        const remove = c.registerListener({
          collapsedChanged: (col) => {
            resolve(col);
            remove?.();
          }
        });
      });
    });

    root.openChildren(true);

    const res = await Promise.all(promises);
    expect(res[0]).toEqual(root.collapsed);
    expect(res[1]).toEqual(child1.collapsed);
    expect(res[2]).toEqual(child2.collapsed);

    expect(root.collapsed).toEqual(false);
    expect(child1.collapsed).toEqual(false);
    expect(child2.collapsed).toEqual(false);

    // add child 3 to child 2
  });
});
