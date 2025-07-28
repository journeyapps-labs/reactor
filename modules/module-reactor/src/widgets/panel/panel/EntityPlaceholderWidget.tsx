import * as React from 'react';
import styled from '@emotion/styled';
import { PanelPlaceholderWidget, PanelPlaceholderWidgetProps } from './PanelPlaceholderWidget';
import { Btn } from '../../../definitions/common';
import { inject } from '../../../inversify.config';
import { PanelButtonWidget } from '../../forms/PanelButtonWidget';
import { WorkspaceModel } from '@projectstorm/react-workspaces-core';
import { System } from '../../../core/System';

export interface EntityPlaceholderWidgetProps<T extends WorkspaceModel, X> {
  placeholder: Partial<PanelPlaceholderWidgetProps>;
  entity: string;
  button: Partial<Btn>;
  patchModel: (entity: X, model: T) => Promise<any>;
  model: T;
}

namespace S {
  export const Center = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  `;
}
export class EntityPlaceholderWidget<T extends WorkspaceModel, X> extends React.Component<
  EntityPlaceholderWidgetProps<T, X>
> {
  @inject(System)
  accessor system: System;

  render() {
    const definition = this.system.getDefinition<X>(this.props.entity);
    return (
      <S.Center>
        <PanelPlaceholderWidget
          {...(this.props.placeholder as any)}
          icon={this.props.placeholder.icon || definition.icon}
        >
          <PanelButtonWidget
            {...this.props.button}
            action={async (event) => {
              const entity = await definition.resolveOneEntity({ event });

              if (entity) {
                await this.props.patchModel(entity, this.props.model);
              }
            }}
          />
        </PanelPlaceholderWidget>
      </S.Center>
    );
  }
}
