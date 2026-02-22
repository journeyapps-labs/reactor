import { configure } from 'mobx';
import { AbstractReactorModule } from './AbstractReactorModule';
import { ioc } from '../inversify.config';
import { Logger } from '@journeyapps-labs/common-logger';
import { createLogger } from './logging';

configure({
  enforceActions: 'never',
  disableErrorBoundaries: false
});

export class ReactorKernel {
  logger: Logger;
  modules: AbstractReactorModule[];

  constructor() {
    this.modules = [];
    this.logger = createLogger('REACTOR_KERNEL');
  }

  registerModule(module: AbstractReactorModule) {
    this.modules.push(module);
  }

  async boot() {
    for (let module of this.modules) {
      this.logger.debug(`Registering module ${module.options.name}`);
      try {
        module.register(ioc);
      } catch (ex) {
        this.logger.error(`Failed to register module ${module.options.name}`, ex);
      }
    }
    await this.init();
  }

  protected async init() {
    for (let m of this.modules) {
      this.logger.debug(`Initializing module ${m.options.name}`);
      try {
        await m.init(ioc);
      } catch (ex) {
        this.logger.error(`Failed to initialize module ${m.options.name}`, ex);
      }
    }
  }
}
