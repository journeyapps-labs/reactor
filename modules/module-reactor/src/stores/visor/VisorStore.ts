import { autorun, makeObservable, observable } from 'mobx';
import * as _ from 'lodash';
import { LoadingDirectiveState, VisorLoadingDirective } from './VisorLoadingDirective';
import { VisorMetadata } from './VisorMetadata';

export class VisorStore {
  private timeout: any;

  @observable
  accessor loadingDirectives: Map<string, VisorLoadingDirective>;

  @observable
  accessor activeMetaData: VisorMetadata[];

  constructor() {
    this.loadingDirectives = new Map<string, VisorLoadingDirective>();
    this.activeMetaData = [];
  }

  loadingDirective(message: string): VisorLoadingDirective {
    return new VisorLoadingDirective(message);
  }

  wrap<T>(message: string, cb: (directive: VisorLoadingDirective) => Promise<T>): Promise<T>;
  wrap<T, L extends VisorLoadingDirective>(directive: L, cb: (directive: L) => Promise<T>): Promise<T>;

  async wrap<T, L extends VisorLoadingDirective = VisorLoadingDirective>(
    directive: L | string,
    cb: (directive: L) => Promise<T>
  ): Promise<T> {
    if (typeof directive == 'string') {
      directive = new VisorLoadingDirective(directive) as L;
    }
    this.pushLoadingDirective(directive);
    try {
      const res = await cb(directive);
      if (!directive.isResolved()) {
        directive.complete();
      }
      return res;
    } finally {
      if (!directive.isResolved()) {
        directive.failed();
      }
    }
  }

  getMetadata(key: string): VisorMetadata {
    return this.activeMetaData.find((f) => f.options.key === key) || null;
  }

  init() {
    for (let metadata of this.activeMetaData) {
      metadata.init();
    }
  }

  registerActiveMetadata(metaData: VisorMetadata) {
    this.activeMetaData.push(metaData);
  }

  getAverageStatus(): LoadingDirectiveState {
    if (this.isLoading()) {
      return LoadingDirectiveState.LOADING;
    }

    // check for error
    if (this.getDirectives().some((d) => d.state === LoadingDirectiveState.ERROR)) {
      return LoadingDirectiveState.ERROR;
    }

    if (this.getDirectives().some((d) => d.state === LoadingDirectiveState.LOADING)) {
      return LoadingDirectiveState.LOADING;
    }

    return LoadingDirectiveState.SUCCESS;
  }

  getDirectives() {
    return Array.from(this.loadingDirectives.values());
  }

  getLatestMessage(): string {
    const ob = _.chain(this.getDirectives())
      .map((directive: VisorLoadingDirective) => {
        return directive.getLastMessage();
      })
      .sortBy(['timestamp'])
      .reverse()
      .first()
      .value();
    return (ob && ob.message) || null;
  }

  pushLoadingDirective(directive: VisorLoadingDirective) {
    _.defer(() => {
      this.loadingDirectives.set(directive.id, directive);
      autorun((event) => {
        if (directive.isResolved()) {
          this.popLoadingDirective();
          event.dispose();
        }
      });
    });
  }

  getLoadingPercentage() {
    return (
      _.sumBy(_.map(this.getDirectives()), (directive) => {
        const percentage = directive.getPercentage();
        if (percentage === null) {
          return 100;
        }
        return percentage;
      }) / this.loadingDirectives.size
    );
  }

  isLoading() {
    return _.some(this.getDirectives(), (event) => {
      return event.state === LoadingDirectiveState.LOADING;
    });
  }

  clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  popLoadingDirective() {
    const loading = this.isLoading();
    if (!loading) {
      this.clearTimeout();
      this.timeout = setTimeout(() => {
        if (!this.isLoading()) {
          this.loadingDirectives.clear();
          this.timeout = null;
        }
      }, 1000);
    }
  }
}
