import _ from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import { observer } from 'mobx-react';
import { CoreTreeWidget } from '../../../../../widgets/core-tree/CoreTreeWidget';
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

export const EntityTreeCollectionWidget = observer(function <T>(props: EntityTreeCollectionWidgetProps<T>) {
  const { event, presenterContext } = props;
  const lockedRef = useRef<boolean>(false);
  const nodes = presenterContext.getTreeNodes(event);

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
});
