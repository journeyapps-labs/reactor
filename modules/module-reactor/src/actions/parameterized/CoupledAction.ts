import { EntityAction, EntityActionEvent, EntityActionOptions } from './EntityAction';
import { ProviderActionParameter } from './params/ProviderActionParameter';
import { EntityActionParams } from './ParameterizedAction';

export enum CoupledActionFocusOption {
  TARGET = 'targetEntity',
  SOURCE = 'sourceEntity'
}

export interface CoupledActionEvent<TARGET = any, SOURCE = any> extends EntityActionEvent<TARGET> {
  [CoupledActionFocusOption.SOURCE]: SOURCE;
  [CoupledActionFocusOption.TARGET]: TARGET;
}

export interface CoupledActionOptions extends EntityActionOptions {
  source: string;
}

export abstract class CoupledAction<
  TARGET = any,
  SOURCE = any,
  Event extends CoupledActionEvent<TARGET, SOURCE> = CoupledActionEvent<TARGET, SOURCE>
> extends EntityAction<TARGET, Event, CoupledActionOptions> {
  constructor(options: CoupledActionOptions) {
    super({
      ...options,
      params: [
        ...(options.params || []),
        new ProviderActionParameter({
          name: EntityActionParams.SOURCE,
          type: options.source
        })
      ]
    });
  }

  async collectParams(event: Event): Promise<boolean> {
    event.entities = {
      ...event.entities,
      source: event.entities['source'] || event.sourceEntity
    };

    if (!(await super.collectParams(event))) {
      return;
    }
    event.sourceEntity = event.entities['source'];
    return true;
  }

  getTypeDisplayName() {
    return 'Coupled Action';
  }
}
