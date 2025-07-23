import { FlattenOptions, Path, PathEntry, PathEntryType, TreeEntity, TreeEntityListener } from './TreeEntity';
import { TreeException } from './TreeException';

export interface TreeSerialized {
  [key: string]: { collapsed: boolean };
}

export interface TreeNodeListener extends TreeEntityListener {
  collapsedChanged: (collapsed: boolean) => any;
  childAdded: (child: TreeEntity) => any;
  childRemoved: (child: TreeEntity) => any;
}

export class TreeNode<T extends TreeNodeListener = TreeNodeListener> extends TreeEntity<T> {
  protected _childrenSet: Set<TreeEntity>;
  protected _childrenMap: Map<string, TreeEntity>;
  collapsed: boolean;

  constructor(key: string) {
    super(key);
    this._childrenSet = new Set();
    this._childrenMap = new Map();
    this.collapsed = true;
  }

  getNodes<T extends TreeNode>(): T[] {
    return this.children.filter((c) => c instanceof TreeNode) as T[];
  }

  getChildPath(element: TreeEntity): PathEntry[] {
    if (!this._childrenSet.has(element)) {
      throw new TreeException(this, `Element with path: [${element.getPathAsString()}] does not exist in this node`);
    }

    if (element instanceof TreeNode) {
      return this.getPath().concat([[PathEntryType.CHILD, element.getKey()]]);
    }
    return this.getPath().concat([[PathEntryType.ATTR, element.getKey()]]);
  }

  get children() {
    return Array.from(this._childrenSet.values());
  }

  getPathEntryType() {
    return PathEntryType.CHILD;
  }

  open() {
    this.setCollapsed(false);
    super.open();
  }

  deserialize(payload: TreeSerialized) {
    for (let key in payload) {
      const node = this.fromPath(key);
      if (node && node instanceof TreeNode) {
        node.setCollapsed(payload[key].collapsed);
      }
    }
  }

  serialize(): TreeSerialized {
    const object: TreeSerialized = {};
    for (let ob of this.flatten()) {
      if (ob instanceof TreeNode) {
        object[ob.getPathAsString()] = {
          collapsed: ob.collapsed
        };
      }
    }
    return object;
  }

  setCollapsed(collapsed: boolean = true) {
    if (collapsed !== this.collapsed) {
      this.collapsed = collapsed;
      this.iterateListeners((cb) => cb.collapsedChanged?.(collapsed));
    }
  }

  openChildren(open: boolean = true) {
    for (let child of this._childrenSet) {
      if (child instanceof TreeNode) {
        child.openChildren(open);
      }
    }
    this.setCollapsed(!open);
  }

  toggle() {
    this.setCollapsed(!this.collapsed);
  }

  getChild<T extends TreeEntity>(key: string): T {
    return this._childrenMap.get(key) as T;
  }

  addChild(child: TreeEntity) {
    if (this._childrenMap.has(child.getKey())) {
      throw new TreeException(this, `Tree with key ${child.getKey()} already exists in this node`);
    }
    child.setParent(this);
    this._childrenSet.add(child);
    this._childrenMap.set(child.getKey(), child);
    const l1 = child.registerListener({
      deleted: () => {
        this._childrenSet.delete(child);
        this._childrenMap.delete(child.getKey());
        child.setParent(null);
        l1?.();
        this.iterateListeners((cb) => cb.childRemoved?.(child));
      }
    });
    this.iterateListeners((cb) => cb.childAdded?.(child));
  }

  clear() {
    this._childrenSet.forEach((c) => {
      c.delete();
    });
  }

  setChildren(children: TreeEntity[]) {
    this.clear();
    children.forEach((c) => {
      this.addChild(c);
    });
  }

  flatten(options?: FlattenOptions): TreeEntity[] {
    let arr: TreeEntity[] = [];

    if (options?.filter?.(this) !== false) {
      arr.push(this);
    }

    for (let child of this._childrenSet) {
      arr = arr.concat(child.flatten(options));
    }
    return arr;
  }

  fromPath(path: Path | string): TreeEntity {
    if (typeof path !== 'string') {
      path = JSON.stringify(path);
    }
    const flatten = this.flatten();
    for (let f of flatten) {
      if (f.getPathAsString() === path) {
        return f;
      }
    }
    return null;
  }
}
