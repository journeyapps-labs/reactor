export type PromiseFunction<T> = (context: MutexContext) => Promise<T>;
export type SharedPromiseFunction<T> = (context: SharedMutexContext) => Promise<T>;

const DEBUG_MUTEX = false;

interface Task {
  exclusive: boolean;
  execute: (context: SharedMutexContext) => void;
}

export interface SharedMutexContext {
  sharedLock<T>(promiseFn: SharedPromiseFunction<T>): Promise<T>;
}

export interface MutexContext extends SharedMutexContext {
  exclusiveLock<T>(promiseFn: PromiseFunction<T>): Promise<T>;
}

class ExclusiveContext implements MutexContext {
  constructor(private mutex: Mutex) {}

  exclusiveLock<T>(promiseFn: PromiseFunction<T>): Promise<T> {
    return promiseFn(this);
  }

  sharedLock<T>(promiseFn: PromiseFunction<T>): Promise<T> {
    return promiseFn(this);
  }
}

class SharedContext implements SharedMutexContext {
  constructor(private mutex: Mutex) {}

  async exclusiveLock<T>(promiseFn: PromiseFunction<T>): Promise<T> {
    throw new Error('Cannot upgrade a shared lock to an exclusive lock.');
  }

  sharedLock<T>(promiseFn: SharedPromiseFunction<T>): Promise<T> {
    return promiseFn(this);
  }
}

/**
 * Mutex maintains a queue of Promise-returning functions that
 * are executed sequentially (whereas normally they would execute their async code concurrently).
 */
export class Mutex implements MutexContext {
  private queue: Task[];
  private sharedCount: number;
  private exclusiveLocked: boolean;

  private emptyQueuePromise: Promise<void>;
  private emptyQueueResolve?: () => void;

  constructor() {
    this.queue = [];
    this.sharedCount = 0;
    this.exclusiveLocked = false;
  }

  /**
   * Returns true if no locks are held: the queue is empty, and no tasks are being executed.
   */
  isFree(): boolean {
    if (this.queue.length > 0) {
      return false;
    }

    if (this.exclusiveLocked) {
      return false;
    }

    if (this.sharedCount > 0) {
      return false;
    }

    return true;
  }

  /**
   * Resolves when no lock is being held: the queue is empty, and no tasks are being executed.
   */
  async waitUntilFree(): Promise<void> {
    if (this.isFree()) {
      return;
    }
    if (this.emptyQueueResolve == null) {
      this.emptyQueuePromise = new Promise<void>((resolve) => {
        this.emptyQueueResolve = resolve;
      });
    }
    await this.emptyQueuePromise.finally(() => {
      this.emptyQueuePromise = null;
      this.emptyQueueResolve = null;
    });
  }

  /**
   * Place a function on the queue.
   * The function may either return a Promise or a value.
   * Return a Promise that is resolved with the result of the function.
   */
  async exclusiveLock<T>(promiseFn: PromiseFunction<T>): Promise<T> {
    return this.lock(promiseFn, true);
  }

  /**
   * Place a function on the queue.
   * This function may execute in parallel with other "multi" functions, but not with other functions on the exclusive
   * queue.
   */
  sharedLock<T>(promiseFn: SharedPromiseFunction<T>): Promise<T> {
    return this.lock(promiseFn, false);
  }

  private async lock<T>(promiseFn: SharedPromiseFunction<T>, exclusive?: boolean): Promise<T> {
    const context = await this._lockNext(exclusive);
    let timeout;
    try {
      if (DEBUG_MUTEX) {
        const stack = new Error().stack;
        timeout = setTimeout(() => {
          console.warn('Mutex not released in 10 seconds\n', stack);
        }, 10000);
      }
      return await promiseFn(context);
    } finally {
      if (DEBUG_MUTEX) {
        clearTimeout(timeout);
      }
      if (!exclusive) {
        this.sharedCount -= 1;
      } else {
        this.exclusiveLocked = false;
      }
      this._tryNext();
    }
  }

  /**
   * Convert a normal Promise-returning function into one that is automatically enqueued.
   * The signature of the function stays the same - only the execution is potentially delayed.
   * The only exception is that if the function would have returned a scalar value, it now
   * returns a Promise.
   */
  qu<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    const self = this;
    return function (...args: any[]) {
      return self.exclusiveLock(() => {
        return fn.apply(this, args);
      });
    } as T;
  }

  /**
   * Like qu, but ensures there is never more than one function on
   * the queue. Note that there may be one running as well as one
   * on the queue.
   *
   * If a call to this function would result in a second item on
   * the queue, the last promise this returned. In that case, any
   * arguments passed to the function are ignored.
   */
  quOnce<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    let queueSize = 0;
    const self = this;
    let lastPromise = null;
    return function (...args: any[]) {
      if (queueSize >= 1) {
        return lastPromise;
      }
      queueSize += 1;
      lastPromise = self.exclusiveLock(() => {
        queueSize -= 1;
        return fn.apply(this, args);
      });
      return lastPromise;
    } as T;
  }

  /**
   * Transform a function into a queued batch processor.
   *
   * @param process The processing function. It takes a batch of items, and must return the same number of results.
   * @param options.limit An optional limit to the number of items passed to a single batch.
   * @param options.debounce Specify to add a delay between queuing a batch and processing the batch.
   */
  batched<T, R>(
    process: (items: T[]) => Promise<R[]>,
    options?: { limit?: number; debounce?: number }
  ): (items: T[]) => Promise<R[]> {
    interface Entry {
      items: T[];
      results: R[];
      processed: boolean;
      error?: any;
    }

    // Configure defaults
    options = {
      limit: null,
      debounce: null,
      ...options
    };
    const limit = options.limit;
    const debounce = options.debounce;

    // The batch queue will currently always contain less entries than the number of queued "process" functions.
    // This may change if we start splitting batches.
    let queue: Entry[] = [];
    return async (items: T[]): Promise<R[]> => {
      // Batch entry for this set of items.
      // It may be an unique entry for these items, or it may be shared with others.
      let entry: Entry;
      if (queue.length > 0 && (limit == null || queue[queue.length - 1].items.length + items.length <= limit)) {
        // Add to last batch
        entry = queue[queue.length - 1];
      } else {
        // Add to queue
        entry = { items: [], results: [], processed: false };
        queue.push(entry);
      }
      const resultOffset = entry.items.length;
      entry.items.push(...items);

      await this.exclusiveLock(async () => {
        if (entry.processed) {
          return;
        }
        if (debounce && queue.length == 1) {
          // Add a debounce delay, during which time more items may be added to the batch.
          // Only do this if the queue only contains a single batch.
          await new Promise((resolve) => setTimeout(resolve, debounce));
        }
        const batch = queue.shift();

        try {
          if (batch == null) {
            // This should be caught by the `entry.processed` check above.
            throw new Error('Internal error: No remaining batch to process');
          }
          if (batch !== entry) {
            // This should be caught by the `entry.processed` check above.
            // We should not be processing a batch without our own items in the current design.
            // This may change if we start splitting batches.
            throw new Error('Internal error: Batch mismatch');
          }

          const results = await process(batch.items);
          if (results == null || results.length != batch.items.length) {
            throw new Error(`Expected ${batch.items.length} results, got ${results ? results.length : results}`);
          }
          batch.results.push(...results);
        } catch (error) {
          batch.error = error;
        } finally {
          batch.processed = true;
        }
      });

      if (entry.error) {
        throw entry.error;
      }

      return entry.results.slice(resultOffset, resultOffset + items.length);
    };
  }

  /**
   * Wait until we are ready to execute the next task on the queue.
   *
   * This places a "Task" marker on the queue, and waits until we get to it.
   *
   * @param exclusive
   */
  private _lockNext(exclusive?: boolean): Promise<SharedMutexContext> {
    var self = this;
    return new Promise<SharedMutexContext>(function (resolve, reject) {
      const task: Task = {
        execute: resolve,
        exclusive
      };
      self.queue.push(task);
      self._tryNext();
    });
  }

  private _tryNext() {
    if (this.queue.length == 0) {
      if (this.emptyQueueResolve && this.isFree()) {
        this.emptyQueueResolve();
      }
      return false;
    }

    if (this.exclusiveLocked) {
      return false;
    }

    var task = this.queue[0];
    if (!task.exclusive) {
      this.sharedCount += 1;
      this.queue.shift();
      task.execute(new SharedContext(this));
    } else if (this.sharedCount == 0) {
      this.exclusiveLocked = true;
      this.queue.shift();
      task.execute(new ExclusiveContext(this));
    } else {
      return false;
    }

    return true;
  }
}
