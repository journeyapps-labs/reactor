import { TreeEntity } from './TreeEntity';

export class TreeException extends Error {
  constructor(
    public tree: TreeEntity,
    error: string
  ) {
    super(error);
  }
}
