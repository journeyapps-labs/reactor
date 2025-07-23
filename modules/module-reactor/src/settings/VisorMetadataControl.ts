import { AbstractSetting } from './AbstractSetting';
import { action, observable } from 'mobx';
import { VisorStore } from '../stores/visor/VisorStore';
import { inject, ioc } from '../inversify.config';
import { VisorMetadata } from '../stores/visor/VisorMetadata';
import { PrefsStore } from '../stores/PrefsStore';

export class VisorMetadataControl extends AbstractSetting {
  @observable
  accessor items: Set<string>;

  @inject(VisorStore)
  accessor visorStore: VisorStore;

  static KEY = 'VISIBLE_VISOR_METADATA';

  constructor() {
    super({
      key: VisorMetadataControl.KEY,
      serializeID: 'v3'
    });
    this.items = new Set();
  }

  getItems(): VisorMetadata[] {
    return this.visorStore.activeMetaData.filter((i) => this.items.has(i.options.key));
  }

  setItems(items: VisorMetadata[]) {
    this.items = new Set(items.map((i) => i.options.key));
    this.save();
  }

  @action reset() {
    this.items = new Set(
      this.visorStore.activeMetaData.filter((f) => f.options.displayDefault).map((m) => m.options.key)
    );
  }

  serialize() {
    return {
      items: Array.from(this.items.values())
    };
  }

  deserialize(data) {
    if (data.items) {
      this.items = new Set(data.items);
    }
  }

  static get() {
    return ioc.get(PrefsStore).getPreference<VisorMetadataControl>(VisorMetadataControl.KEY);
  }
}
