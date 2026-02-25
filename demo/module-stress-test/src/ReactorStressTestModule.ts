import { Container } from '@journeyapps-labs/common-ioc';
import { AbstractReactorModule, System } from '@journeyapps-labs/reactor-mod';
import { StressTestEntityDefinition } from './entities/StressTestEntityDefinition';

export class ReactorStressTestModule extends AbstractReactorModule {
  constructor() {
    super({
      name: 'Reactor stress test'
    });
  }

  register(ioc: Container) {
    const system = ioc.get(System);

    system.registerDefinition(new StressTestEntityDefinition());
  }

  async init(ioc: Container): Promise<any> {}
}
