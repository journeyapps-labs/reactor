import { SearchEngineParameter, SearchEngineParameterOptions } from './SearchEngineParameter';

export interface EntitySearchEngineParameterOptions extends SearchEngineParameterOptions {
  entityType: string;
}

export class EntitySearchEngineParameter extends SearchEngineParameter<EntitySearchEngineParameterOptions> {}
