import { inject } from '../../inversify.config';
import { GuideStore } from '../../stores/guide/GuideStore';
import * as _ from 'lodash';
import { GuideTooltipWidget } from './GuideTooltipWidget';
import * as React from 'react';
import { Observer } from 'mobx-react';
import { LayerDirective } from '../../stores/layer/LayerDirective';

export class GuideLayer extends LayerDirective {
  @inject(GuideStore)
  accessor guideStore: GuideStore;

  getLayerContent(): React.JSX.Element {
    return (
      <Observer
        render={() => {
          return (
            <>
              {_.filter(this.guideStore.selections, (c) => {
                return !!c.tooltip;
              }).map((c) => {
                return <GuideTooltipWidget key={c.id} selection={c} />;
              })}
            </>
          );
        }}
      />
    );
  }

  layerWillHide(): boolean {
    return false;
  }

  alwaysOnTop(): boolean {
    return true;
  }

  transparent(): boolean {
    return true;
  }

  show(): boolean {
    return _.size(this.guideStore.selections) > 0;
  }
}
