import { AbstractDropZone, HandleDropEvent } from './AbstractDropZone';
import { EncodedEntity } from '../../../entities/components/encoder/EntityEncoderComponent';

export const ENTITY_MIME_IDENTIFIER = 'entity:';

export interface EntityMimeEncoding {
  type: string;
  id: string;
}

export const constructMimeFromEncodedEntity = (entity: EncodedEntity) => {
  return `${ENTITY_MIME_IDENTIFIER}${JSON.stringify({
    type: entity.type,
    id: entity.id
  })}`;
};

export abstract class AbstractEntityDropZone extends AbstractDropZone {
  constructor() {
    super();
  }

  acceptsMimeType(inType: string): boolean {
    if (!inType.startsWith(ENTITY_MIME_IDENTIFIER)) {
      return false;
    }

    try {
      const encoded = JSON.parse(inType.substr(ENTITY_MIME_IDENTIFIER.length)) as EntityMimeEncoding;
      return this._acceptsEncodedObject(encoded);
    } catch (ex) {}
    return false;
  }

  async handleDrop(event: HandleDropEvent) {
    let entities: EncodedEntity[] = [];
    for (let type in event.data) {
      if (this.acceptsMimeType(type)) {
        const encoded = JSON.parse(event.data[type]) as EncodedEntity;
        entities.push(encoded);
      }
    }
    this._handleDrop(event, entities);
  }

  protected abstract _handleDrop(event: HandleDropEvent, entities: EncodedEntity[]);

  protected abstract _acceptsEncodedObject(object: EntityMimeEncoding): boolean;
}
