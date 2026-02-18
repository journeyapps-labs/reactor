import * as React from 'react';
import * as _ from 'lodash';
import {
  CMDPalletGenerateResultWidgetEvent,
  CMDPalletSearchEngine,
  CMDPalletSearchEngineResult,
  CommandPalletSearchResultEntry
} from './CMDPalletSearchEngine';
import { Provider, SerializedEntity } from '../providers/Provider';
import { ProviderSearchResultSerialized } from '../providers/ProviderSearchResult';
import { ThemeStore } from '../stores/themes/ThemeStore';
import { SearchEvent } from '@journeyapps-labs/lib-reactor-search';
import { CommandPalletEntryWidget } from '../layers/command-pallet/CommandPalletEntryWidget';
import { theme } from '../stores/themes/reactor-theme-fragment';

export interface ProviderSearchEngineOptions<E extends SerializedEntity> {
  provider: Provider<any, E>;
  themeStore: ThemeStore;
  limit?: number;
}

export interface ProviderSearchResultEntry<E extends SerializedEntity> extends CommandPalletSearchResultEntry {
  serialized: E;
}

export class CMDPalletProviderSearchEngine<E extends SerializedEntity = SerializedEntity> extends CMDPalletSearchEngine<
  ProviderSearchResultEntry<E>
> {
  constructor(protected options2: ProviderSearchEngineOptions<E>) {
    super({
      displayName: options2.provider.options.displayName,
      limit: options2.limit
    });
  }

  getWidget(
    entry: ProviderSearchResultSerialized<any, E>,
    event: CMDPalletGenerateResultWidgetEvent
  ): React.JSX.Element {
    let light = this.options2.themeStore.getCurrentTheme(theme).light;
    let color = (light ? entry.serialized.colorLight : entry.serialized.color) || 'lightgray';
    return (
      <CommandPalletEntryWidget
        color={color}
        forwardRef={event.ref}
        icon={this.options2.provider.getIcon(entry.serialized)}
        primary={entry.serialized.display}
        selected={event.selected}
        mouseEntered={event.mouseEntered}
        mouseClicked={event.mouseClicked}
        key={event.key}
      />
    );
  }

  doSearch(event: SearchEvent): CMDPalletSearchEngineResult<ProviderSearchResultEntry<E>> {
    const res = this.options2.provider.doSearchSerialized(event);
    const transformed = new CMDPalletSearchEngineResult<ProviderSearchResultEntry<E>>(this);
    res.pipe(transformed, (results) => {
      return _.map(results, (result) => {
        return {
          key: `${this.options2.provider.options.type}-${result.key}`,
          engine: this,
          serialized: result.serialized,
          getWidget: (event) => {
            return this.getWidget(result, event);
          }
        } as ProviderSearchResultEntry<E>;
      });
    });
    return transformed;
  }

  async handleSelection(entry: ProviderSearchResultEntry<E>) {
    const m = await this.options2.provider.deserialize(entry.serialized);
    this.options2.provider.openEntity(m);
    return true;
  }
}
