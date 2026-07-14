import * as React from 'react';
import { ioc } from '../../inversify.config';
import { ComboBoxStore2 } from '../../stores/combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { getTreeEntityMetadataKey, type TreeEntityDetailsDisplayModel } from './TreeEntityDetailsModel';

export const useTreeEntityDetailsOverflowMenu = (details: TreeEntityDetailsDisplayModel) =>
  React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      ioc.get(ComboBoxStore2).show(
        new SimpleComboBoxDirective({
          event,
          items: [
            ...details.tags.map((tag) => ({ key: `tag:${tag}`, title: tag, group: 'Tags', icon: 'tags' as const })),
            ...details.metadata.map((item) => ({
              key: `metadata:${getTreeEntityMetadataKey(item)}`,
              title: `${item.label}: ${item.value}`,
              group: 'Metadata',
              icon: item.icon?.name || ('list' as const)
            }))
          ]
        })
      );
    },
    [details]
  );
