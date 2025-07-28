import { beforeEach, expect, it, vi } from 'vitest';
import {
  AbstractEntityTreePresenterContext,
  DescendantLoadingEntityProviderComponent,
  EntityDefinition,
  EntityReactorNode,
  InlineTreePresenterComponent,
  ioc,
  ReactorTreeNode,
  System
} from '../src';
// @ts-ignore
window.matchMedia = () => {};

interface Child {
  id: string;
}

interface Parent {
  id: string;
  children: Child[];
}

class ParentDef extends EntityDefinition<Parent> {
  constructor() {
    // @ts-ignore
    super({
      type: 'parent'
    });
    this.registerComponent(new InlineTreePresenterComponent());
  }

  getEntityUID(t: any) {}

  matchEntity(t: any): boolean {
    return t.children === undefined;
  }
}

class ChildDef extends EntityDefinition<Child> {
  constructor() {
    // @ts-ignore
    super({
      type: 'child'
    });
    this.registerComponent(new InlineTreePresenterComponent());
  }

  getEntityUID(t: Child) {
    return t.id;
  }

  matchEntity(t: any): boolean {
    return t.children !== undefined;
  }
}

beforeEach(() => {
  ioc.unbind(System);
});

it('Should work with descendents that are not sub-categorized', () => {
  const system = new System();
  const parentDef = new ParentDef();
  const childDef = new ChildDef();
  system.registerDefinition(parentDef);
  system.registerDefinition(childDef);

  const refreshed = vi.fn();

  ioc.bind(System).toConstantValue(system);

  parentDef.registerComponent(
    new DescendantLoadingEntityProviderComponent<Parent, Child>({
      descendantType: 'child',
      generateOptions: ({ children }) => {
        return {
          descendants: children,
          refreshDescendants: refreshed
        };
      }
    })
  );

  let context = system
    .getDefinition('parent')
    .getPresenters()[0]
    .generateContext() as AbstractEntityTreePresenterContext;
  let nodes = context.getTreeNodes({
    entities: [
      {
        id: '1',
        children: [
          {
            id: '1'
          },
          {
            id: '2'
          }
        ]
      }
    ]
  }) as EntityReactorNode[];
  expect(nodes[0].collapsed).toEqual(true);
  // simulate it being rendered
  nodes[0].setVisible(true);
  nodes[0].setAttached(true);
  nodes[0].open();

  context.saveState();
  expect(context.serialize()).toMatchSnapshot();

  expect(nodes[0].children.length).toEqual(2);
  expect(refreshed).toHaveBeenCalledOnce();
});

it('Should work with descendents that are sub-categorized', () => {
  const system = new System();
  const parentDef = new ParentDef();
  const childDef = new ChildDef();
  system.registerDefinition(parentDef);
  system.registerDefinition(childDef);

  ioc.bind(System).toConstantValue(system);

  const refreshed = vi.fn();

  parentDef.registerComponent(
    new DescendantLoadingEntityProviderComponent<Parent, Child>({
      descendantType: 'child',
      generateOptions: ({ children }) => {
        return {
          descendants: children,
          category: {
            label: 'sub category 1'
          },
          refreshDescendants: refreshed
        };
      }
    })
  );

  let context = system
    .getDefinition('parent')
    .getPresenters()[0]
    .generateContext() as AbstractEntityTreePresenterContext;
  let nodes = context.getTreeNodes({
    entities: [
      {
        id: '1',
        children: [
          {
            id: '1'
          },
          {
            id: '2'
          }
        ]
      }
    ]
  }) as EntityReactorNode[];
  expect(nodes[0].collapsed).toEqual(true);
  nodes[0].open();

  context.saveState();
  expect(context.serialize()).toMatchSnapshot();

  // simulate it being rendered
  nodes[0].setVisible(true);
  nodes[0].setAttached(true);
  expect(nodes[0].children.length).toEqual(1);
  const category = nodes[0].children[0] as ReactorTreeNode;
  category.setVisible(true);
  category.open();
  expect(category.children.length).toEqual(2);
  expect(refreshed).toHaveBeenCalledOnce();
});
