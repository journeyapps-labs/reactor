import React from 'react';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { RenderCollectionOptions } from '../../AbstractPresenterContext';
import { EntityCardsPresenterContext, NestedTreeRenderOption } from './EntityCardsPresenterComponent';
import { CardWidget } from '../../../../../widgets/cards/CardWidget';
import { PillWidget } from '../../../../../widgets/status/PillWidget';
import { MetaBarWidget } from '../../../../../widgets/meta/MetaBarWidget';
import { PanelPlaceholderWidget } from '../../../../../widgets/panel/panel/PanelPlaceholderWidget';
import { themed } from '../../../../../stores/themes/reactor-theme-fragment';
import { ActionSource } from '../../../../../actions';
import { IconWidget } from '../../../../../widgets/icons/IconWidget';
import { MatchesWidget } from '../../../../../widgets/search/MatchesWidget';
import { SearchEvent } from '@journeyapps-labs/lib-reactor-search';

export interface EntityCardsCollectionWidgetProps<T> {
  event: RenderCollectionOptions<T>;
  presenterContext: EntityCardsPresenterContext<T>;
}

export interface EntityCardWidgetProps<T> {
  entity: T;
  presenterContext: EntityCardsPresenterContext<T>;
  searchEvent?: SearchEvent;
}

namespace S {
  export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 10px;
  `;

  export const Card = themed(CardWidget)`
    cursor: pointer;
    overflow: hidden;
    min-width: 0;
  `;

  export const CardWrapper = styled.div`
    cursor: pointer;
    min-width: 0;
  `;

  export const PillRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  `;

  export const TagPill = themed(PillWidget)`
    background: ${(p) =>
      p.theme.light
        ? 'rgba(129, 139, 153, 0.9)'
        : p.theme.guide.accent === 'rgb(184 107 255)'
          ? 'rgba(112, 128, 145, 0.62)'
          : 'rgba(98, 114, 134, 0.7)'} !important;

    > div:first-of-type {
      background: ${(p) =>
        p.theme.light
          ? 'rgba(0, 0, 0, 0.18)'
          : p.theme.guide.accent === 'rgb(184 107 255)'
            ? 'rgba(0, 0, 0, 0.08)'
            : 'rgba(0, 0, 0, 0.12)'};
      color: ${(p) =>
        p.theme.light
          ? 'rgba(255, 255, 255, 0.95)'
          : p.theme.guide.accent === 'rgb(184 107 255)'
            ? 'rgba(222, 232, 242, 0.88)'
            : 'rgba(227, 236, 249, 0.92)'};
    }
  `;

  export const CardTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  export const CardTitleLabel = themed.div`
    font-size: 14px;
    font-weight: bold;
    color: ${(p) => p.theme.cards.foreground};
  `;

  export const CardTitleIcon = themed(IconWidget)<{ color?: string }>`
    color: ${(p) => p.color || p.theme.cards.foreground};
  `;

  export const Labels = styled(MetaBarWidget)``;
  export const NestedSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `;

  export const NestedHeader = themed.div`
    font-size: 12px;
    color: ${(p) => p.theme.cards.foreground};
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.04em;
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
});

export const EntityCardWidget = observer(function <T>(props: EntityCardWidgetProps<T>) {
  const { entity, presenterContext, searchEvent } = props;
  const encoded = presenterContext.definition.encode(entity, false);
  const selected = presenterContext.batchStore.isSelected(encoded);
  const description = presenterContext.definition.describeEntity(entity);
  let titleMatch = null;
  if (description.simpleName) {
    titleMatch =
      searchEvent?.matches?.(description.simpleName, {
        nullIsTrue: false
      }) || null;
  }
  const labels = description.labels || [];
  const tags = description.tags || [];
  const nestedTrees = presenterContext.getNestedTreeRenderOptions(entity);

  return (
    <S.CardWrapper
      onClick={(event) => {
        presenterContext.handleClick(entity, event as any, ActionSource.CARD);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
        presenterContext.handleContextMenu(entity, event as any);
      }}
    >
      <S.Card
        selected={selected}
        title={
          <S.CardTitle>
            {description.icon ? <S.CardTitleIcon icon={description.icon} color={description.iconColor} /> : null}
            <S.CardTitleLabel>
              {titleMatch ? (
                <MatchesWidget text={description.simpleName} locators={titleMatch.locators} />
              ) : (
                description.simpleName
              )}
            </S.CardTitleLabel>
          </S.CardTitle>
        }
        subHeading={description.complexName}
        color={description.iconColor}
        sections={[
          labels.length > 0
            ? {
                key: 'labels',
                content: () => {
                  return <S.Labels meta={labels} />;
                }
              }
            : null,
          tags.length > 0
            ? {
                key: 'tags',
                content: () => {
                  return (
                    <S.PillRow>
                      {tags.map((tag) => (
                        <S.TagPill key={`tag-${tag}`} label={tag} />
                      ))}
                    </S.PillRow>
                  );
                }
              }
            : null,
          {
            key: 'nested-trees',
            content: () => {
              if (nestedTrees.length === 0) {
                return null;
              }

              return (
                <>
                  {nestedTrees.map((nested: NestedTreeRenderOption) => {
                    return (
                      <S.NestedSection key={nested.key}>
                        <S.NestedHeader>{nested.label}</S.NestedHeader>
                        {nested.context.renderCollection({
                          entities: nested.entities
                        })}
                      </S.NestedSection>
                    );
                  })}
                </>
              );
            }
          }
        ].filter((f) => !!f)}
      />
    </S.CardWrapper>
  );
});
