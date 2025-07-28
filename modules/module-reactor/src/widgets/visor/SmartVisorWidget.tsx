import * as React from 'react';
import { observer } from 'mobx-react';
import { VisorWidget } from './VisorWidget';
import { inject } from '../../inversify.config';
import { VisorStore } from '../../stores/visor/VisorStore';
import { VisorMetadataControl } from '../../settings/VisorMetadataControl';

@observer
export class SmartVisorWidget extends React.Component {
  @inject(VisorStore)
  accessor visorStore: VisorStore;

  render() {
    return <VisorWidget metadata={VisorMetadataControl.get().getItems()} />;
  }
}
