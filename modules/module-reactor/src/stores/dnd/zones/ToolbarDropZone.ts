import { HandleDropEvent } from './AbstractDropZone';
import { AbstractEntityDropZone, EntityMimeEncoding } from './AbstractEntityDropZone';
import { EncodedEntity } from '../../../entities/components/encoder/EntityEncoderComponent';
import { ToolbarPreference } from '../../../settings/ToolbarPreference';

export class ToolbarDropZone extends AbstractEntityDropZone {
  index: number;

  constructor(protected preference: ToolbarPreference) {
    super();
  }

  protected _acceptsEncodedObject(object: EntityMimeEncoding): boolean {
    return true;
  }

  protected _handleDrop(event: HandleDropEvent, entities: EncodedEntity[]) {
    entities.forEach((e) => {
      this.preference.addButton(e);
    });
  }
}
