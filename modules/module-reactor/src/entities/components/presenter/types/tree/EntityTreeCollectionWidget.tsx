import _ from 'lodash';
import { autorun } from 'mobx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CoreTreeWidget } from '../../../../../widgets/core-tree/CoreTreeWidget';
import { ReactorTreeEntity } from '../../../../../widgets/core-tree/reactor-tree/reactor-tree-utils';
import { PanelPlaceholderWidget } from '../../../../../widgets/panel/panel/PanelPlaceholderWidget';
import { RenderCollectionOptions } from '../../AbstractPresenterContext';
import { AbstractEntityTreePresenterContext } from './presenter-contexts/AbstractEntityTreePresenterContext';
import { EntityReactorNode } from './EntityReactorNode';
import { EntityReactorLeaf } from './EntityReactorLeaf';
import { SearchableEntityTreeWidget } from './SearchableEntityTreeWidget';

export interface EntityTreeCollectionWidgetProps<T extends any> {
  event: RenderCollectionOptions<T>;
  presenterContext: AbstractEntityTreePresenterContext<T>;
}

export const EntityTreeCollectionWidget = function <T>(props: EntityTreeCollectionWidgetProps<T>) {
  const { event, presenterContext } = props;
  const [nodes, setNodes] = useState<ReactorTreeEntity[]>([]);
  const lockedRef = useRef<boolean>(false);
  const eventRef = useRef(event);

  const saveState = useMemo(() => {
    return _.debounce(
      () => {
        presenterContext.saveState();
      },
      100,
      { leading: false, trailing: true }
    );
  }, [presenterContext]);

  useEffect(() => {
    return () => {
      saveState.cancel();
    };
  }, [saveState]);

  useEffect(() => {
    eventRef.current = event;
  }, [event]);

  useEffect(() => {
    if (!event.searchEvent?.search) {
      // Search mode mutates collapse state to reveal matches. When leaving search mode,
      // rebuild nodes so persisted pre-search tree state is re-applied via deserialize.
      setNodes(presenterContext.getTreeNodes(eventRef.current));
    }
  }, [!event.searchEvent?.search]);

  useEffect(() => {
    return autorun(
      () => {
        setNodes(presenterContext.getTreeNodes(eventRef.current));
      },
      { name: `EntityTreeCollectionWidget:${presenterContext.definition.type}` }
    );
  }, [presenterContext]);

  useEffect(() => {
    return event.events?.registerListener({
      selectEntity: (entity) => {
        if (lockedRef.current) {
          return;
        }
        _.chain(nodes)
          .flatMap((n) => n.flatten())
          .filter((n) => n instanceof EntityReactorNode || n instanceof EntityReactorLeaf)
          .forEach((n: EntityReactorNode) => {
            if (n.entity === entity) {
              let p = n.getParent();

              // already visible, no need to do anything
              if (!p) {
                return;
              }

              // need to open up the element
              while (!!p) {
                p.open({ reveal: true });
                p = p.getParent();
              }

              // fire the events again so the leaf which is now visible, scrolls into view
              _.defer(() => {
                lockedRef.current = true;
                event.events.iterateListeners((cb) => cb.selectEntity?.(entity));
                _.defer(() => {
                  lockedRef.current = false;
                });
              });
            }
          })
          .value();
      }
    });
  }, [event.events, nodes]);

  if (nodes.length === 0) {
    return <PanelPlaceholderWidget center={true} icon="clone" text="No entities to display" />;
  }

  if (event.searchEvent?.search) {
    return <SearchableEntityTreeWidget nodes={nodes} search={event.searchEvent.search} />;
  }

  const jsxElements = nodes.map((tree) => {
    return (
      <CoreTreeWidget
        tree={tree}
        key={tree.getPathAsString()}
        events={{
          updated: () => {
            saveState();
          }
        }}
      />
    );
  });

  return <>{jsxElements}</>;
};
