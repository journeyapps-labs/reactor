import _ from 'lodash';
import { autorun } from 'mobx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CoreTreeWidget, ReactorTreeEntity, SearchableCoreTreeWidget } from '../../../../../widgets';
import { RenderCollectionOptions } from '../../AbstractPresenterContext';
import { AbstractEntityTreePresenterContext } from './presenter-contexts/AbstractEntityTreePresenterContext';
import { EntityReactorNode } from './EntityReactorNode';
import { EntityReactorLeaf } from './EntityReactorLeaf';

export interface EntityTreeCollectionWidgetProps<T extends any> {
  event: RenderCollectionOptions<T>;
  presenterContext: AbstractEntityTreePresenterContext<T>;
}

export const EntityTreeCollectionWidget = function <T>(props: EntityTreeCollectionWidgetProps<T>) {
  const { event, presenterContext } = props;
  const [nodes, setNodes] = useState<ReactorTreeEntity[]>([]);
  const lockedRef = useRef<boolean>(false);

  const saveState = useCallback(
    _.debounce(
      () => {
        presenterContext.saveState();
      },
      100,
      { leading: false, trailing: true }
    ),
    []
  );

  useEffect(() => {
    return autorun(
      () => {
        setNodes(presenterContext.getTreeNodes(event));
      },
      { name: `EntityTreeCollectionWidget:${presenterContext.definition.type}` }
    );
  }, [event]);

  useEffect(() => {
    return props.event.events?.registerListener({
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
                props.event.events.iterateListeners((cb) => cb.selectEntity?.(entity));
                _.defer(() => {
                  lockedRef.current = false;
                });
              });
            }
          })
          .value();
      }
    });
  }, [nodes]);

  // common properties for each node / leaf
  const jsxElements = nodes.map((tree) => {
    // render as searchable tree
    if (event.searchEvent?.search) {
      return (
        <SearchableCoreTreeWidget
          tree={tree}
          key={tree.getPathAsString()}
          matchNode={() => {
            return false;
          }}
          matchLeaf={() => {
            return false;
          }}
          search={event.searchEvent.search}
        />
      );
    }
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
