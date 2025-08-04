import { Container } from '@journeyapps-labs/common-ioc';

export interface AbstractReactorModuleOptions {
  name: string;
}

export abstract class AbstractReactorModule {
  options: AbstractReactorModuleOptions;

  constructor(options: AbstractReactorModuleOptions) {
    this.options = options;
  }

  abstract register(ioc: Container);

  abstract init(ioc: Container): Promise<any>;
}
