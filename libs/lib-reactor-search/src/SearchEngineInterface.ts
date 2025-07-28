import * as _ from 'lodash';
import { distance } from 'fastest-levenshtein';
import { SearchResult, SearchResultEntry } from './SearchResult';

/**
 * Fast search term generator that trims and null checks
 */
export const trimSearch = _.memoize((a: string): string | null => {
  if (a == null) {
    return null;
  }
  const s = a.trim().toLowerCase();
  if (s === '') {
    return null;
  }
  return s;
});

/**
 * Fast searcher that checks two strings and caters for null
 */
const searcher = _.memoize((options: { search: string; entity: string; nullIsTrue?: boolean }): SearchEventMatch => {
  const searchTrimmed = trimSearch(options.search);

  // null is a bit more tricky
  if (searchTrimmed === null) {
    if (options.nullIsTrue ?? true) {
      return {
        locators: []
      };
    }
    return false;
  }

  const pos = options.entity.toLowerCase().indexOf(searchTrimmed);
  if (pos !== -1) {
    return {
      locators: [
        {
          locatorStart: pos,
          locatorEnd: pos + searchTrimmed.length
        }
      ]
    };
  }

  const match = distance(searchTrimmed, options.entity.toLowerCase());
  if (match < 2) {
    return {
      locators: []
    };
  }

  return false;
});

export type SearchEventMatcher = (a: string) => SearchEventMatch;

export const createSearchEventMatcherBool = (a: string, options: { nullIsTrue?: boolean } = {}) => {
  return (c: string) => {
    return !!searcher({
      search: a,
      entity: c,
      ...options
    });
  };
};

export const createSearchEventMatcher = (a: string, options: { nullIsTrue?: boolean } = {}) => {
  return (c: string) => {
    return searcher({
      search: a,
      entity: c,
      ...options
    });
  };
};

export type SearchEventLocators = { locatorStart: number; locatorEnd: number }[];

export type SearchEventMatch =
  | {
      locators: SearchEventLocators;
    }
  | false;

export interface SearchEvent {
  search: string;
  matches: (input: string, options?: { nullIsTrue?: boolean }) => SearchEventMatch;
}

export interface SearchEngineInterface<T extends SearchResultEntry, S extends SearchEvent = SearchEvent> {
  doSearch(event: SearchEvent): SearchResult<T>;
}
