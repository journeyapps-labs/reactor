import { AbstractStore } from './AbstractStore';
import * as _ from 'lodash';

export class SearchHistoryContext {
  terms: string[];

  constructor() {
    this.terms = [];
  }

  push(term: string) {
    if (!term) {
      return;
    }
    term = term.trim();
    if (this.terms.indexOf(term) !== -1) {
      return;
    }

    this.terms.push(term);
  }

  getTerms(amount: number = 5) {
    return _.takeRight(this.terms, amount).reverse();
  }
}

export class SearchStore extends AbstractStore {
  contexts: Map<string, SearchHistoryContext>;

  constructor() {
    super({
      name: 'SEARCH'
    });
    this.contexts = new Map();
  }

  getHistoryContext(context: string) {
    if (!this.contexts.has(context)) {
      this.contexts.set(context, new SearchHistoryContext());
    }
    return this.contexts.get(context);
  }
}
