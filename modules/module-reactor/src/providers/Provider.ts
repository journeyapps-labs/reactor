import * as _ from 'lodash';
import {
  ProviderSearchResult,
  ProviderSearchResultEntity,
  ProviderSearchResultSerialized
} from './ProviderSearchResult';
import { ReactorIcon } from '../widgets/icons/IconWidget';
import { ComboBoxStore, ProviderComboBoxOptions } from '../stores/combo/ComboBoxStore';
import { System } from '../core/System';
import { ioc } from '../inversify.config';
import { MousePosition } from '../layers/combo/SmartPositionWidget';
import { SearchEngineInterface, SearchEvent } from '@journeyapps-labs/lib-reactor-search';

export interface ProviderOptions {
  displayName: string;
  icon: ReactorIcon;
  type: string;
  cmdPallet?: boolean;
  parentProvider?: string;
}

export interface SerializedEntity {
  type: string;
  display: string;
  color?: string;
  colorLight?: string;
  icon?: ReactorIcon;
}

export interface ProviderSearchEvent<PARENT_ENTITY = any> extends SearchEvent {
  param?: PARENT_ENTITY;
}

/**
 * @deprecated
 */
export abstract class Provider<
  ENTITY = any,
  SERIALIZED extends SerializedEntity = SerializedEntity
> implements SearchEngineInterface<ProviderSearchResultEntity<ENTITY>> {
  options: ProviderOptions;
  system: System;

  constructor(options: ProviderOptions) {
    if (options.cmdPallet == null) {
      options.cmdPallet = true;
    }
    this.options = options;
  }

  setApplication(system: System) {
    this.system = system;
  }

  /**
   * Given a serialized entity, get an icon representation.
   */
  getIcon(entity: SERIALIZED): ReactorIcon {
    if (entity?.icon) {
      return entity.icon;
    } else {
      return this.options.icon;
    }
  }

  /**
   * Takes in a serialized entity and decoded it back into its original form (and actual pointer reference)
   */
  abstract deserialize(entity: SERIALIZED): Promise<ENTITY>;

  /**
   * Takes in an entity and encodes it so it can be used for drag an drop,
   * and actions when they are sent through IPC systems
   */
  serialize(entity: ENTITY): SERIALIZED {
    return {
      type: this.options.type,
      color: 'rgb(150,150,150)'
    } as SERIALIZED;
  }

  async selectEntity(options: { event: MousePosition } & ProviderComboBoxOptions<ENTITY>): Promise<ENTITY | null> {
    let entity = options.param;
    if (!entity && this.options.parentProvider) {
      entity = await this.system.getProvider(this.options.parentProvider).selectEntity({
        event: options.event
      });
      if (!entity) {
        return null;
      }
    }
    let result = await ioc.get(ComboBoxStore).showSearchComboBoxForProvider<ENTITY>(this, options.event, {
      ...(options || {}),
      param: entity
    });

    return result || null;
  }

  doSearchSerialized(
    event: ProviderSearchEvent
  ): ProviderSearchResult<ProviderSearchResultSerialized<ENTITY, SERIALIZED>> {
    const transformed = new ProviderSearchResult<ProviderSearchResultSerialized<ENTITY, SERIALIZED>>();

    // observe the original search result, and transform it when it changes
    this.doSearch(event).pipe(
      transformed,
      (res) => {
        return _.map(res, (result) => {
          return {
            ...result,
            serialized: this.serialize(result.entity)
          };
        });
      },
      (entity) => {
        transformed.setFooterHint(entity.footerHint);
      }
    );
    return transformed;
  }

  openEntity(entity: ENTITY) {
    // do nothing
  }

  abstract doSearch(event: ProviderSearchEvent): ProviderSearchResult<ProviderSearchResultEntity<ENTITY>>;
}
