import { SimpleProvider } from './SimpleProvider';
import { SerializedEntity } from './Provider';
import * as _ from 'lodash';
import { Theme, ThemeStore } from '../stores/themes/ThemeStore';
import { ioc } from '../inversify.config';
import { SearchEvent } from '@journeyapps-labs/lib-reactor-search';
import { ProviderSearchResult, ProviderSearchResultEntity } from './ProviderSearchResult';

export interface SerializedTheme extends SerializedEntity {
  key: string;
}

export class ThemeProvider extends SimpleProvider<Theme, SerializedTheme> {
  constructor() {
    super({
      cmdPallet: true,
      displayName: 'Theme',
      icon: 'paint-brush',
      type: 'theme'
    });
  }

  async deserialize(entity: SerializedTheme): Promise<Theme> {
    return ioc
      .get(ThemeStore)
      .getThemes()
      .find((t) => t.key === entity.key);
  }

  serialize(entity: Theme): SerializedTheme {
    return {
      ...super.serialize(entity),
      key: entity.key,
      display: entity.label
    };
  }

  async getEntities(event: SearchEvent): Promise<Theme[]> {
    return _.filter(ioc.get(ThemeStore).getThemes(), (theme) => {
      return !!event.matches(theme.label);
    });
  }

  doSearch(event: SearchEvent): ProviderSearchResult<ProviderSearchResultEntity<Theme>> {
    return super.doSearch(event);
  }

  openEntity(entity: Theme) {
    ioc.get(ThemeStore).selectedTheme.setItem(entity);
  }
}
