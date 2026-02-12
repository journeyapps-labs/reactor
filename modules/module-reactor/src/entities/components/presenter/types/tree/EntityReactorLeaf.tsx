import { CoreTreeWidgetProps } from '../../../../../widgets/core-tree/CoreTreeWidget';
import { ReactorTreeLeaf } from '../../../../../widgets/core-tree/reactor-tree/ReactorTreeLeaf';
import { ReactorEntityDnDWrapper } from './widgets/ReactorEntityDnDWrapperWidget';
import { ReactorEntityWrapperWidget } from './widgets/ReactorEntityWrapperWidget';
import React from 'react';
import { EntityReactorNodeOptions } from './EntityReactorNode';

export class EntityReactorLeaf extends ReactorTreeLeaf {
  constructor(protected options2: EntityReactorNodeOptions) {
    super({
      key: options2.definition.getEntityUID(options2.entity),
      match: (event) => {
        return event.matches(options2.definition.describeEntity(options2.entity).simpleName);
      }
    });
  }

  get entity() {
    return this.options2.entity;
  }

  renderWidget(event: CoreTreeWidgetProps): React.JSX.Element {
    return (
      <ReactorEntityDnDWrapper definition={this.options2.definition} node={this} entity={this.options2.entity}>
        {(ref) => {
          return (
            <ReactorEntityWrapperWidget forwardRef={ref} node={this} options={this.options2}>
              {super.renderWidget({
                ...event,
                forwardRef: ref
              })}
            </ReactorEntityWrapperWidget>
          );
        }}
      </ReactorEntityDnDWrapper>
    );
  }
}
