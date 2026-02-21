import { AbstractActionParameter, AbstractActionParameterOptions } from './AbstractActionParameter';
import { System } from '../../../core/System';
import { ioc } from '../../../inversify.config';
import { RenderCalloutFunction } from '../../../stores/combo/ComboBoxDirectives';
import { ParameterizedActionEvent } from '../ParameterizedAction';
import { EntityDefinition } from '../../../entities/EntityDefinition';

export interface ProviderActionParameterOptions<T> extends AbstractActionParameterOptions {
  type: string;
  renderCallout?: RenderCalloutFunction;
  getDefaultDecoded?: (event: ParameterizedActionEvent) => Promise<any>;
  getInitialDecoded?: (event: ParameterizedActionEvent) => Promise<any>;
  autoSelectIsolatedItem?: boolean;
  filter?: (item: T) => boolean;
}

export class ProviderActionParameter<T> extends AbstractActionParameter<ProviderActionParameterOptions<T>> {
  getDefinition(): EntityDefinition<T> {
    return ioc.get(System).getDefinition(this.options.type);
  }

  async getValue(event: ParameterizedActionEvent): Promise<boolean> {
    // we have a valida value
    if (event.entities[this.options.name]) {
      return true;
    }

    // try default
    const defaultEntity = await this.options.getDefaultDecoded?.(event);
    if (defaultEntity != null) {
      event.entities[this.options.name] = defaultEntity;
      return true;
    }

    // fetch one from the definition
    const def = this.getDefinition();
    if (def) {
      const selectedItem = await def.resolveOneEntity({
        event: event.position,
        autoSelectedIsolatedEntity: this.options.autoSelectIsolatedItem,
        filter: (entity) => {
          let definition = ioc.get(System).getDefinitionForEntity(entity);
          if (definition && !definition.isActionAllowedForEntity(this.action, entity)) {
            return false;
          }
          if (this.options.filter) {
            return this.options.filter(entity);
          }
          return true;
        }
      });
      if (!selectedItem) {
        return false;
      }
      event.entities[this.options.name] = selectedItem;
      return true;
    }

    return false;
  }
}
