import { AbstractActionParameter, AbstractActionParameterOptions } from './AbstractActionParameter';
import { System } from '../../../core/System';
import { ioc } from '../../../inversify.config';
import { RenderCalloutFunction } from '../../../stores/combo/ComboBoxDirectives';
import { ParameterizedActionEvent } from '../ParameterizedAction';
import { EntityDefinition } from '../../../entities/EntityDefinition';
import { EntityActionParams } from '../ParameterizedAction';
import { ActionValidationState } from '../../validators/ActionValidator';
import * as React from 'react';
import { ActionMetaWidget } from '../../ActionMetaWidget';

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
            if (!this.options.filter(entity)) {
              return false;
            }
          }
          return this.action.validate(this.getCandidateEvent(event, entity)).type !== ActionValidationState.HIDDEN;
        },
        transformItem: (entity, item) => {
          const candidateEvent = this.getCandidateEvent(event, entity);
          const validation = this.action.validate(candidateEvent);
          return {
            ...item,
            disabled:
              validation.type === ActionValidationState.DISABLED ||
              validation.type === ActionValidationState.PENDING ||
              validation.type === ActionValidationState.BLOCKED,
            right: React.createElement(ActionMetaWidget, {
              action: this.action,
              eventData: candidateEvent
            })
          };
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

  private getCandidateEvent(event: ParameterizedActionEvent, entity: T): ParameterizedActionEvent {
    const candidateEvent = {
      ...event,
      entities: {
        ...event.entities,
        [this.options.name]: entity
      }
    } as ParameterizedActionEvent & {
      targetEntity?: unknown;
      sourceEntity?: unknown;
    };

    candidateEvent.targetEntity = candidateEvent.entities[EntityActionParams.TARGET];
    candidateEvent.sourceEntity = candidateEvent.entities[EntityActionParams.SOURCE];

    return candidateEvent;
  }
}
