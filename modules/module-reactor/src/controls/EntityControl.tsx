import { RepresentAsComboBoxItemsEvent } from './AbstractControl';
import { ComboBoxItem } from '../stores/combo/ComboBoxDirectives';
import { v4 } from 'uuid';
import { inject } from '../inversify.config';
import { System } from '../core/System';
import { EntityButtonWidget } from '../widgets/forms/EntityButtonWidget';
import * as React from 'react';
import { useEffect } from 'react';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { Btn } from '../definitions/common';
import { AbstractValueControl, AbstractValueControlOptions } from './AbstractValueControl';

export interface EntityControlOptions<Entity extends any> extends AbstractValueControlOptions<Entity> {
  entityType: string;
  parent?: any;
}

export class EntityControl<Entity = any> extends AbstractValueControl<Entity, EntityControlOptions<Entity>> {
  @inject(System)
  accessor system: System;

  get entityType() {
    return this.options.entityType;
  }

  get definition() {
    return this.system.getDefinition<Entity>(this.entityType);
  }

  get parent() {
    return this.options.parent;
  }

  representAsComboBoxItems(options: RepresentAsComboBoxItemsEvent = {}): ComboBoxItem[] {
    return [
      {
        key: v4(),
        title: options.label,
        action: async (event) => {
          const entity = await this.definition.resolveOneEntity({
            event
          });
          if (entity) {
            this.value = entity;
          }
        }
      }
    ];
  }

  representAsControl(): React.JSX.Element {
    return <EntityControlWidget control={this} />;
  }

  representAsBtn(): Btn {
    const e = this.definition.describeEntity(this.value);
    return {
      icon: e.icon,
      label: e.simpleName,
      action: (event) => {
        this.definition.resolveOneEntity({
          event,
          parent: this.options.parent
        });
      }
    };
  }
}

export interface EntityControlWidgetProps {
  control: EntityControl;
}

export const EntityControlWidget: React.FC<EntityControlWidgetProps> = (props) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    return props.control.registerListener({
      valueChanged: () => {
        forceUpdate();
      }
    });
  }, []);

  return (
    <EntityButtonWidget
      allowClearing={false}
      entity={props.control.value}
      entityType={props.control.entityType}
      parent={props.control.parent}
      onChange={(item) => {
        if (item) {
          props.control.value = item;
        }
      }}
    />
  );
};
