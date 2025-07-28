import { AbstractStore } from '../AbstractStore';
import { makeObservable, observable } from 'mobx';
import { AbstractDropZone } from './zones/AbstractDropZone';

export class DNDStore extends AbstractStore {
  @observable
  accessor draggingEntity: boolean;

  dropZones: Set<AbstractDropZone>;

  constructor() {
    super({
      name: 'Drag and Drop Store'
    });
    this.draggingEntity = false;
    this.dropZones = new Set();
  }

  dragEntity(mimes: string[] = []) {
    this.draggingEntity = mimes.length !== 0;

    for (let zone of this.dropZones) {
      if (mimes.length === 0) {
        zone.highlight(false);
      } else if (mimes.some((mime) => zone.acceptsMimeType(mime))) {
        zone.highlight(true);
      }
    }
  }

  registerDropZone(dropzone: AbstractDropZone) {
    this.dropZones.add(dropzone);
    return () => {
      this.dropZones.delete(dropzone);
    };
  }
}
