import { Provider, SerializedEntity, ProviderSearchEvent } from './Provider';
import * as _ from 'lodash';
import { ProviderSearchResult, ProviderSearchResultEntity } from './ProviderSearchResult';

/**
 * @deprecated
 */
export abstract class SimpleProvider<
  ENTITY = any,
  SERIALIZED extends SerializedEntity = SerializedEntity
> extends Provider<ENTITY, SERIALIZED> {
  abstract getEntities(event: ProviderSearchEvent): Promise<ENTITY[]>;

  doSearch(event: ProviderSearchEvent): ProviderSearchResult<ProviderSearchResultEntity<ENTITY>> {
    const result = new ProviderSearchResult<ProviderSearchResultEntity<ENTITY>>();
    this.getEntities(event).then((entities) => {
      result.setValues(
        _.map(entities, (entity, index) => {
          return {
            entity: entity,
            key: JSON.stringify(this.serialize(entity))
          };
        }) as ProviderSearchResultEntity<ENTITY>[]
      );
    });
    return result;
  }
}
