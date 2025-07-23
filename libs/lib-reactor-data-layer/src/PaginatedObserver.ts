import { observable, action, autorun, IReactionDisposer, makeObservable, when } from 'mobx';
import * as sdk from '@journeyapps-platform/sdk-common';
import { SearchResult, SearchResultEntry } from '@journeyapps-labs/lib-reactor-search';

export interface PaginatedObserverSearchResultEntry<T = any> extends SearchResultEntry {
  item: T;
}

export class PaginatedObserverSearchResult<T extends any> extends SearchResult<PaginatedObserverSearchResultEntry<T>> {
  observer: PaginatedObserver;
  disposer: IReactionDisposer;

  constructor(observer: PaginatedObserver) {
    super();
    this.observer = observer;
    this.disposer = autorun(
      () => {
        this.loading = observer ? observer.loading : false;
      },
      {
        name: 'paginated-observer-search-result'
      }
    );
  }

  dispose() {
    super.dispose();
    this.disposer?.();
  }

  hasMore() {
    if (!this.observer) {
      return false;
    }
    return this.observer.hasMore();
  }

  loadMore() {
    if (!this.observer) {
      return;
    }
    return this.observer.load();
  }
}

export interface PaginatedObserverAsSearchResultOptions<T> {
  idTransformer: (item: T) => string;
  match: (item: T) => boolean;
}

/**
 * This system takes api calls from SDK that are of type `PaginatedResponse` and makes them observerables.
 * It also has the ability to turn those observerables into search results.
 *
 * TODO: merge this with PaginatedCollection in reactor
 * @deprecated
 */
export abstract class PaginatedObserver<T = any, P extends sdk.PaginationResponse = sdk.PaginationResponse> {
  @observable
  accessor data: T[];

  @observable
  protected accessor lastResponse: P;

  @observable
  protected accessor iterator: AsyncIterator<P>;

  @observable
  public accessor loading: boolean;

  constructor() {
    this.data = [];
    this.lastResponse = null;
    this.iterator = null;
    this.loading = false;
  }

  abstract collect(page: P): T[];

  abstract fetchInitial(): AsyncIterator<P> | Promise<AsyncIterator<P>>;

  async fetchAll() {
    await when(
      () => {
        return !this.loading;
      },
      {
        name: 'paginated-observer'
      }
    );
    while (this.hasMore()) {
      await this.load();
    }
  }

  hasMore(): boolean {
    if (!this.lastResponse) {
      return true;
    }
    return this.lastResponse?.more;
  }

  asSearchResult(options: PaginatedObserverAsSearchResultOptions<T>): PaginatedObserverSearchResult<T> {
    const result = new PaginatedObserverSearchResult<T>(this);
    const runner = autorun(() => {
      if (!this.lastResponse) {
        return;
      }
      result.setValues(
        this.data
          .filter((d) => options.match(d))
          .map((d) => {
            return {
              item: d,
              key: options.idTransformer(d)
            };
          })
      );
    });
    result.registerListener({
      dispose: () => {
        runner();
      }
    });

    // also load the entries
    this.loadInitial();
    return result;
  }

  loadInitial() {
    return this.load();
  }

  @action async load() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    if (!this.iterator) {
      this.iterator = await this.fetchInitial();
    }
    if (this.lastResponse && !this.lastResponse.more) {
      this.loading = false;
      return;
    }

    const next = await this.iterator.next();

    if (!next.done) {
      this.lastResponse = next.value;
      this.data = this.data.concat(this.collect(this.lastResponse));
    }

    this.loading = false;
  }
}
