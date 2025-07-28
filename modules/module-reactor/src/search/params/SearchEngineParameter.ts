export interface SearchEngineParameterOptions {
  required?: boolean;
  label: string;
  key: string;
}
export class SearchEngineParameter<T extends SearchEngineParameterOptions = SearchEngineParameterOptions> {
  constructor(public options: T) {}
}
