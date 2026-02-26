import { ReactorTreeLeaf, ReactorTreeNode, SearchableTreeSearchScope } from '@journeyapps-labs/reactor-mod';

type CoreTreeVariant = {
  key: string;
  title: string;
  subtitle: string;
  tree: ReactorTreeNode;
  searchScope: SearchableTreeSearchScope;
};

const createLeaf = (key: string, label: string = key) => {
  return new ReactorTreeLeaf({
    key,
    getTreeProps: () => ({
      label
    }),
    match: (event) => event.matches(label)
  });
};

const createNode = (key: string, label: string = key, children: Array<ReactorTreeNode | ReactorTreeLeaf> = []) => {
  const node = new ReactorTreeNode({
    key,
    getTreeProps: () => ({
      label
    }),
    match: (event) => event.matches(label)
  });
  children.forEach((child) => {
    node.addChild(child);
  });
  return node;
};

const buildStaticCoreTree = (prefix: string) => {
  const drinks = createNode(`${prefix}-drinks`, 'Drinks', [
    createLeaf(`${prefix}-coffee`, 'Coffee beans'),
    createLeaf(`${prefix}-tea`, 'Tea leaves'),
    createLeaf(`${prefix}-water`, 'Sparkling water')
  ]);

  const groceries = createNode(`${prefix}-groceries`, 'Groceries', [
    createLeaf(`${prefix}-eggs`, 'Eggs'),
    createLeaf(`${prefix}-bread`, 'Bread'),
    createLeaf(`${prefix}-butter`, 'Butter')
  ]);

  const root = createNode(`${prefix}-root`, 'Shopping list', [drinks, groceries]);
  root.open({ reveal: false });
  return root;
};

const buildLazyCoreTree = (prefix: string) => {
  const installLazyChildren = (
    node: ReactorTreeNode,
    childrenFactory: () => Array<ReactorTreeNode | ReactorTreeLeaf>
  ) => {
    node.registerListener({
      collapsedChanged: () => {
        if (!node.collapsed && node.children.length === 0) {
          childrenFactory().forEach((child) => {
            node.addChild(child);
          });
          return;
        }
        if (node.collapsed && node.children.length > 0) {
          [...node.children].forEach((child) => {
            child.delete();
          });
        }
      }
    });
  };

  const drinks = createNode(`${prefix}-drinks`, 'Drinks');
  installLazyChildren(drinks, () => {
    return [
      createLeaf(`${prefix}-coffee`, 'Coffee beans'),
      createLeaf(`${prefix}-tea`, 'Tea leaves'),
      createLeaf(`${prefix}-water`, 'Sparkling water')
    ];
  });

  const groceries = createNode(`${prefix}-groceries`, 'Groceries');
  installLazyChildren(groceries, () => {
    return [
      createLeaf(`${prefix}-eggs`, 'Eggs'),
      createLeaf(`${prefix}-bread`, 'Bread'),
      createLeaf(`${prefix}-butter`, 'Butter')
    ];
  });

  const root = createNode(`${prefix}-root`, 'Shopping list', [drinks, groceries]);
  root.open({ reveal: false });
  return root;
};

export const buildCoreTreeVariants = (): CoreTreeVariant[] => {
  return [
    {
      key: 'core-full-tree',
      title: 'Core Tree (Full Tree Search)',
      subtitle: 'SearchableCoreTreeWidget with searchScope = FULL_TREE',
      tree: buildStaticCoreTree('core-full'),
      searchScope: SearchableTreeSearchScope.FULL_TREE
    },
    {
      key: 'core-lazy-tree',
      title: 'Core Tree (Lazy Child Loading)',
      subtitle: 'Children are generated when the node opens',
      tree: buildLazyCoreTree('core-lazy'),
      searchScope: SearchableTreeSearchScope.FULL_TREE
    },
    {
      key: 'core-visible-tree',
      title: 'Core Tree (Visible-Only Search)',
      subtitle: 'SearchableCoreTreeWidget with searchScope = VISIBLE_ONLY',
      tree: buildStaticCoreTree('core-visible'),
      searchScope: SearchableTreeSearchScope.VISIBLE_ONLY
    }
  ];
};
