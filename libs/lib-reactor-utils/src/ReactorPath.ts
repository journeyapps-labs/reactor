import * as path from 'path';
import * as _ from 'lodash';
import { minimatch } from 'minimatch';

export class ReactorPath {
  static IMAGE_EXTENSIONS = ['.png', '.jpeg', '.jpg', '.svg', '.gif'];

  static isImage = _.memoize((filename: string) => {
    const extension = path.extname(filename).toLowerCase();
    return ReactorPath.IMAGE_EXTENSIONS.indexOf(extension) !== -1;
  });

  static isBinary = _.memoize((filename: string) => {
    return ReactorPath.isImage(filename);
  });

  static normalize = _.memoize((directory: string) => {
    directory = _.trim(directory, '/');
    if (directory === '') {
      return '';
    }
    return path.normalize(directory);
  });

  static join(...parts: string[]) {
    if (parts.length === 0) {
      return '';
    }
    return ReactorPath.normalize(parts.join('/'));
  }

  static startsWith = _.memoize(
    (base: string, check: string) => {
      return ReactorPath.normalize(base).startsWith(ReactorPath.normalize(check));
    },
    (base, check) => {
      return `${base}:${check}`;
    }
  );

  /**
   *
   */
  static split = _.memoize((directory: string) => {
    directory = ReactorPath.normalize(directory);
    if (directory == '') {
      return [];
    }
    return directory.split('/');
  });

  static equals(...paths: string[]): boolean {
    if (paths.length <= 1) {
      throw new Error('need 2 or more paths to perform match');
    }
    paths = paths.map((p) => ReactorPath.normalize(p));
    for (let i = 0; i < paths.length - 1; i++) {
      if (paths[i] !== paths[i + 1]) {
        return false;
      }
    }
    return true;
  }

  static matches(path: string, glob: string) {
    return minimatch(ReactorPath.normalize(path), glob);
  }
}
