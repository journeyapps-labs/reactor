import { configure } from 'mobx';
configure({
  enforceActions: 'never',
  disableErrorBoundaries: false
});

import { AbstractReactorModule } from './AbstractReactorModule';
import { ioc } from '../inversify.config';
import { Logger } from '@journeyapps-labs/lib-reactor-utils';
import { createRoot } from 'react-dom/client';
import * as React from 'react';
import { UXStore } from '../stores/UXStore';

export class ReactorKernel {
  logger: Logger;
  modules: AbstractReactorModule[];

  constructor() {
    this.modules = [];
    this.logger = new Logger('REACTOR_KERNEL');
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
    await this.render();
  }

  async render() {
    document.querySelector('.loader').remove();
    const root = ioc.get(UXStore).rootComponent;
    const rootElement = createRoot(document.querySelector('#application'));
    rootElement.render(React.createElement(root));
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
