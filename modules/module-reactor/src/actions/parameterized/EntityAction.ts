import {
  EntityActionParams,
  ParameterizedAction,
  ParameterizedActionEvent,
  ParameterizedActionGenerics,
  ParameterizedActionOptions
} from './ParameterizedAction';
import { ProviderActionParameter } from './params/ProviderActionParameter';

export interface EntityActionOptions<T = any> extends ParameterizedActionOptions {
  target: string;
  initialTargetValue?: () => Promise<T>;
  /**
   * Allow the action to run with batch processing. When enabled, the action appears in the right click menu
   * when multiple entities are selected
   * @default false
   */
  batch?: boolean;
  /**
   * When running in batch mode, how many items to run concurrently
   * @default 1
   */
  batch_concurrency?: number;
  /**
   * If the provider can return options immediately, select the first option
   * if there is only one option in the immediate result set
   */
  autoSelectIsolatedTarget?: boolean;
}

export interface EntityActionEvent<
  Target = any,
  DecodedParameters = {}
> extends ParameterizedActionEvent<DecodedParameters> {
  targetEntity: Target;
}

export abstract class EntityAction<
  Target = any,
  Event extends EntityActionEvent<Target> = EntityActionEvent<Target>,
  Options extends EntityActionOptions<Target> = EntityActionOptions<Target>
> extends ParameterizedAction<
  ParameterizedActionGenerics & {
    EVENT: Event;
    OPTIONS: Options;
  }
> {
  constructor(options: Options) {
    super({
      ...options,
      category: {
        entityType: options.target,
        ...(options.category ? options.category : {})
      },
      batch_concurrency: options.batch_concurrency || 1,
      params: [
        ...(options.params || []),
        new ProviderActionParameter({
          name: EntityActionParams.TARGET,
          type: options.target,
          autoSelectIsolatedItem: options.autoSelectIsolatedTarget,
          getInitialDecoded: options.initialTargetValue
        })
      ]
    });
  }

  async collectParams(event: Event): Promise<boolean> {
    event.entities = {
      ...event.entities,
      target: event.entities['target'] || event.targetEntity
    };

    if (!(await super.collectParams(event))) {
      return;
    }
    event.targetEntity = event.entities['target'];
    return true;
  }

  getTypeDisplayName() {
    return 'Entity Action';
  }
}
