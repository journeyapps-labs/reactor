import { AbstractStore } from '@journeyapps-labs/reactor-mod';

export class PlaygroundStore extends AbstractStore {
  constructor() {
    super({ name: 'PLAYGROUND_STORE' });
  }
}
