import * as React from 'react';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import { EntityPanelModel } from './EntityPanelFactory';
import { observer } from 'mobx-react';
import { LoadingPanelWidget } from '../../../../widgets/panel/panel/LoadingPanelWidget';
import { SearchablePanelWidget } from '../../../../widgets/search/SearchablePanelWidget';
import { ioc } from '../../../../inversify.config';
import { System } from '../../../../core/System';
import { ComboBoxStore2 } from '../../../../stores/combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../../../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { BatchStore } from '../../../../stores/batch/BatchStore';
import { autorun } from 'mobx';
import { useForceUpdate } from '../../../../hooks/useForceUpdate';

export interface EntityPanelWidgetProps {
  model: EntityPanelModel;
}

export const EntityPanelWidget: React.FC<EntityPanelWidgetProps> = observer((props) => {
  const system = ioc.get(System);
  const comboBoxStore = ioc.get(ComboBoxStore2);
  const batchStore = ioc.get(BatchStore);
  const forceUpdate = useForceUpdate();

  const { model } = props;
  const { presenterContext } = model;

  useEffect(() => {
    let callbacks: (() => any)[] = [];

    let disposer = autorun(
      () => {
        callbacks?.forEach((c) => c());

        callbacks = Array.from(props.model.presenterContext.getControls()).map((control) => {
          return control.registerListener({
            valueChanged: (value) => {
              forceUpdate();
            }
          });
        });
      },
      {
        name: `EntityPanelWidget:${props.model.definition.type}`
      }
    );
    return () => {
      callbacks?.forEach((c) => c());
      disposer?.();
    };
  }, []);

  return (
    <LoadingPanelWidget
      loading={props.model.isLoading()}
      children={() => {
        return (
          <S.Container
            onClick={() => {
              batchStore.clearSelection();
            }}
            onContextMenu={async (e) => {
              e.preventDefault();

              // 1) get actions based on the category
              let actions = system
                .getActions()
                .filter((a) => a.options.category?.entityType === props.model.definition.type)
                .concat();

              // 2) merge in additional actions that are explicitly given
              actions = actions.concat(
                (props.model.component.additionalActions || [])
                  .filter((a) => {
                    return !actions.find((existing) => existing.id == a);
                  })
                  .map((a) => system.getActionByID(a))
              );

              comboBoxStore.show(
                new SimpleComboBoxDirective({
                  items: actions.map((a) => a.representAsComboBoxItem({ installAction: true })).filter((a) => !!a),
                  event: e
                })
              );
            }}
          >
            <SearchablePanelWidget
              historyContext={`entity-definition-panel-${props.model.component.definition.type}`}
              getContent={(event) => {
                return presenterContext.renderCollection({
                  searchEvent: event.search ? event : null,
                  entities: props.model.getElements(),
                  events: props.model
                });
              }}
            />
          </S.Container>
        );
      }}
    />
  );
});

namespace S {
  export const Container = styled.div`
    height: 100%;
  `;
}
