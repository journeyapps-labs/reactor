import React from 'react';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { RenderCollectionOptions } from '../../AbstractPresenterContext';
import { EntityCardsPresenterContext } from './EntityCardsPresenterComponent';
import { PanelPlaceholderWidget } from '../../../../../widgets/panel/panel/PanelPlaceholderWidget';
import { EntityCardWidget } from './EntityCardWidget';
import { GroupedEntityCardsWidget } from './GroupedEntityCardsWidget';
import { REACTOR_MOBILE_MEDIA_QUERY } from '../../../../../hooks/useReactorViewportMode';

export interface EntityCardsCollectionWidgetProps<T> {
  event: RenderCollectionOptions<T>;
  presenterContext: EntityCardsPresenterContext<T>;
}

namespace S {
  export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    align-items: stretch;
    gap: 10px;
    width: 100%;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      display: flex;
      flex-direction: column;
    }
  `;

  export const Empty = styled(PanelPlaceholderWidget)`
    min-height: 220px;
  `;
}

export const EntityCardsCollectionWidget = observer(function <T>(props: EntityCardsCollectionWidgetProps<T>) {
  const entities = props.presenterContext.getRenderableEntities(props.event);
  if (entities.length === 0) {
    return <S.Empty center={true} icon="clone" text="No entities to display" />;
  }

  if (!props.presenterContext.isGroupingEnabled()) {
    return (
      <S.Grid>
        {entities.map((entity) => {
          return (
            <EntityCardWidget
              key={props.presenterContext.definition.getEntityUID(entity)}
              entity={entity}
              presenterContext={props.presenterContext}
              searchEvent={props.event.searchEvent}
            />
          );
        })}
      </S.Grid>
    );
  }

  return (
    <GroupedEntityCardsWidget
      entities={entities}
      presenterContext={props.presenterContext}
      searchEvent={props.event.searchEvent}
    />
  );
});
