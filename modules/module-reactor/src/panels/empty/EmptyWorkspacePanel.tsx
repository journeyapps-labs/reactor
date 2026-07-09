import * as React from 'react';
import styled from '@emotion/styled';
import { WorkspaceCollectionModel, WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { observer } from 'mobx-react';
import { AdvancedWorkspacePreference } from '../../preferences/AdvancedWorkspacePreference';
import * as _ from 'lodash';
import { PanelPlaceholderWidget } from '../../widgets/panel/panel/PanelPlaceholderWidget';
import { ReactorPanelModel } from '../../stores/workspace/react-workspaces/ReactorPanelModel';
import { ReactorPanelFactory } from '../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { EntityPlaceholderWidget } from '../../widgets/panel/panel/EntityPlaceholderWidget';
import { ReactorEntities } from '../../entities-reactor/ReactorEntities';
import { SurfaceWidget } from '../../widgets';

export interface EmptyWorkspacePanelProps {
  event: WorkspaceModelFactoryEvent<ReactorPanelModel>;
  factory: ReactorPanelFactory;
}

namespace S {
  export const Container = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  `;

  export const Select = themed.div`
    font-size: 18px;
    color: ${(p) => p.theme.panels.trayBackground}
  `;

  export const Placeholder = themed(SurfaceWidget)`
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin-bottom: 40px;
    width: 300px;
    height: 300px;
  `;
}

@observer
export class EmptyWorkspacePanel extends React.Component<EmptyWorkspacePanelProps> {
  getSelector() {
    return (
      <EntityPlaceholderWidget<ReactorPanelModel, ReactorPanelFactory>
        entity={ReactorEntities.PANEL}
        placeholder={{
          text: 'No panel selected'
        }}
        button={{
          label: 'Select a panel'
        }}
        model={this.props.event.model}
        patchModel={async (factory, model) => {
          (model.parent as WorkspaceCollectionModel).replaceModel(model, factory.generateModel());
        }}
      />
    );
  }

  getHint() {
    const rootModel = this.props.event.model.getRootModel();
    const panels = rootModel
      .flatten()
      .map((p) => {
        try {
          const factory = this.props.event.engine.getFactory(p.type);
          if (factory instanceof ReactorPanelFactory && factory.generateEditorPanelSiblingSuggestion()) {
            return factory.generateEditorPanelSiblingSuggestion();
          }
        } catch (ex) {
          return null;
        }
      })
      .filter((p) => !!p);
    const highestSuggestionsFirst = _.orderBy(panels, ['score'], ['desc']);
    const highestSuggestion = _.first(highestSuggestionsFirst);
    if (highestSuggestion) {
      return <PanelPlaceholderWidget {...highestSuggestion.placeholder} />;
    }

    return <PanelPlaceholderWidget icon="cube" text="Please select something!" />;
  }

  render() {
    return (
      <S.Container>
        <S.Placeholder>{AdvancedWorkspacePreference.enabled() ? this.getSelector() : this.getHint()}</S.Placeholder>
      </S.Container>
    );
  }
}
