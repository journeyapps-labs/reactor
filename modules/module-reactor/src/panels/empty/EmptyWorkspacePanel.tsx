import * as React from 'react';
import styled from '@emotion/styled';
import { PanelWidget } from '../../widgets/panel/panel/PanelWidget';
import { WorkspaceCollectionModel, WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { observer } from 'mobx-react';
import { AdvancedWorkspacePreference } from '../../preferences/AdvancedWorkspacePreference';
import * as _ from 'lodash';
import { PanelPlaceholderWidget } from '../../widgets/panel/panel/PanelPlaceholderWidget';
import { PanelTitleWidget } from '../../widgets/panel/panel/title/PanelTitleWidget';
import { ReactorPanelModel } from '../../stores/workspace/react-workspaces/ReactorPanelModel';
import { ReactorPanelFactory } from '../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { EntityPlaceholderWidget } from '../../widgets/panel/panel/EntityPlaceholderWidget';
import { ReactorEntities } from '../../entities-reactor/ReactorEntities';

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

  export const Placeholder = themed.div`
    flex-grow: 1;
    align-self: stretch;
    margin: 10px;
    background: ${(p) => p.theme.panels.divider};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin-bottom: 40px;
  `;
}

@observer
export class EmptyWorkspacePanel extends React.Component<EmptyWorkspacePanelProps> {
  getSelector() {
    return (
      <S.Container>
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
      </S.Container>
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
      return (
        <>
          <PanelTitleWidget color="#fff" model={null} name={highestSuggestion.panelTitle} />
          <S.Container>
            <S.Placeholder>
              <PanelPlaceholderWidget {...highestSuggestion.placeholder} />
            </S.Placeholder>
          </S.Container>
        </>
      );
    }

    return (
      <>
        <PanelTitleWidget color="#fff" model={null} name="..." />
        <S.Container>
          <S.Placeholder>
            <PanelPlaceholderWidget icon="cube" text="Please select something!" />
          </S.Placeholder>
        </S.Container>
      </>
    );
  }

  render() {
    return (
      <PanelWidget event={this.props.event} factory={this.props.factory}>
        {AdvancedWorkspacePreference.enabled() ? this.getSelector() : this.getHint()}
      </PanelWidget>
    );
  }
}
