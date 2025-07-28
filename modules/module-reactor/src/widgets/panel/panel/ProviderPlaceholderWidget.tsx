import * as React from 'react';
import styled from '@emotion/styled';
import { PanelPlaceholderWidget, PanelPlaceholderWidgetProps } from './PanelPlaceholderWidget';
import { Btn } from '../../../definitions/common';
import { ComboBoxStore } from '../../../stores/combo/ComboBoxStore';
import { inject } from '../../../inversify.config';
import { PanelButtonWidget } from '../../forms/PanelButtonWidget';
import { WorkspaceModel } from '@projectstorm/react-workspaces-core';
import { System } from '../../../core/System';

export interface ProviderPlaceholderWidgetProps<T extends WorkspaceModel, X> {
  placeholder: Partial<PanelPlaceholderWidgetProps>;
  provider: string;
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

/**
 * @deprecated use EntityPlaceholderWidget
 */
export class ProviderPlaceholderWidget<T extends WorkspaceModel, X> extends React.Component<
  ProviderPlaceholderWidgetProps<T, X>
> {
  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  @inject(System)
  accessor system: System;

  render() {
    const provider = this.system.getProvider(this.props.provider);
    return (
      <S.Center>
        <PanelPlaceholderWidget
          {...(this.props.placeholder as any)}
          icon={this.props.placeholder.icon || (provider.options.icon as any)}
        >
          <PanelButtonWidget
            {...this.props.button}
            action={async (event) => {
              const provided = await this.comboBoxStore.showSearchComboBoxForProvider<X>(provider, event);
              if (provided) {
                await this.props.patchModel(provided, this.props.model);
              }
            }}
          />
        </PanelPlaceholderWidget>
      </S.Center>
    );
  }
}
