const IGNORE_TIME_ENTRY = 'ignore';

class IgnoringWatchFileSystem {
  constructor(protected wfs) {}

  watch(files, dirs, missing, startTime, options, callback, callbackUndelayed) {
    files = Array.from(files);
    dirs = Array.from(dirs);
    const ignored = (path) => [/dist-module/].some((p) => (p instanceof RegExp ? p.test(path) : path.indexOf(p) === 0));

    const notIgnored = (path) => !ignored(path);

    const ignoredFiles = files.filter(ignored);
    const ignoredDirs = dirs.filter(ignored);

    const watcher = this.wfs.watch(
      files.filter(notIgnored),
      dirs.filter(notIgnored),
      missing,
      startTime,
      options,
      (err, fileTimestamps, dirTimestamps, changedFiles, removedFiles) => {
        if (err) return callback(err);
        for (const path of ignoredFiles) {
          fileTimestamps.set(path, IGNORE_TIME_ENTRY);
        }

        for (const path of ignoredDirs) {
          dirTimestamps.set(path, IGNORE_TIME_ENTRY);
        }

        callback(err, fileTimestamps, dirTimestamps, changedFiles, removedFiles);
      },
      callbackUndelayed
    );

    return {
      close: () => watcher.close(),
      pause: () => watcher.pause(),
      getContextTimeInfoEntries: () => {
        const dirTimestamps = watcher.getContextTimeInfoEntries();
        for (const path of ignoredDirs) {
          dirTimestamps.set(path, IGNORE_TIME_ENTRY);
        }
        return dirTimestamps;
      },
      getFileTimeInfoEntries: () => {
        const fileTimestamps = watcher.getFileTimeInfoEntries();
        for (const path of ignoredFiles) {
          fileTimestamps.set(path, IGNORE_TIME_ENTRY);
        }
        return fileTimestamps;
      }
    };
  }
}

export class WatchIgnorePlugin {
  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('WatchIgnorePlugin', () => {
      compiler.watchFileSystem = new IgnoringWatchFileSystem(compiler.watchFileSystem);
    });
  }
}
