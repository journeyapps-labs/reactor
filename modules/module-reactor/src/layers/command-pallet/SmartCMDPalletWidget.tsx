import * as React from 'react';
import { inject } from '../../inversify.config';
import { CMDPalletStore } from '../../stores/CMDPalletStore';
import { CommandPalletSearchResultEntry } from '../../cmd-pallet/CMDPalletSearchEngine';
import { ControlledCommandPalletWidget } from './ControlledCommandPalletWidget';
import * as _ from 'lodash';
import { MousePosition } from '../combo/SmartPositionWidget';
import { createSearchEventMatcher } from '@journeyapps-labs/lib-reactor-search';

export interface SmartCMDPalletWidgetProps {
  focused: boolean;
  selected: string;
}

export class SmartCMDPalletWidget extends React.Component<SmartCMDPalletWidgetProps> {
  listener: any;

  @inject(CMDPalletStore)
  accessor commandPalletStore: CMDPalletStore;

  render() {
    return (
      <ControlledCommandPalletWidget
        close={() => {
          this.commandPalletStore.showPallet(false);
        }}
        tabSelected={this.props.selected}
        tabs={this.commandPalletStore.getCategories().map((category) => {
          return {
            key: category.name,
            name: category.name
          };
        })}
        focused={this.props.focused}
        enter={(entry: CommandPalletSearchResultEntry, event: MousePosition) => {
          requestAnimationFrame(async () => {
            // we might not want to close the pallet on selection (such as when selecting preference toggles)
            if (entry.engine.handleEnter(entry, event)) {
              if (entry.immediatelyClose == null || entry.immediatelyClose) {
                this.commandPalletStore.showPallet(false);
              }
            }
          });
        }}
        selected={async (entry: CommandPalletSearchResultEntry, event: MousePosition) => {
          // we might not want to close the pallet on selection (such as when selecting preference toggles)
          if (entry.engine.handleSelection(entry, event)) {
            this.commandPalletStore.showPallet(false);
          }
        }}
        getSearchResults={(search: string, tab) => {
          return _.map(this.commandPalletStore.getSearchEngines(tab), (engine) => {
            return engine.doSearch({
              search: search,
              matches: createSearchEventMatcher(search)
            });
          });
        }}
      />
    );
  }
}
