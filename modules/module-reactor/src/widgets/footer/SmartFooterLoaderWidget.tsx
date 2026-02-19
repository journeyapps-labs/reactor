import * as React from 'react';
import { observer } from 'mobx-react';
import { ioc } from '../../inversify.config';
import { VisorStore } from '../../stores/visor/VisorStore';
import { FooterLoaderWidget } from './FooterLoaderWidget';

export const SmartFooterLoaderWidget: React.FC = observer((props) => {
  const visorStore = ioc.get(VisorStore);
  return (
    <FooterLoaderWidget
      show={visorStore.getDirectives().length > 0}
      mode={visorStore.getAverageStatus()}
      percentage={visorStore.getLoadingPercentage() || 20}
    />
  );
});
