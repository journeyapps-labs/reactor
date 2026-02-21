import * as _ from 'lodash';
import { ComponentBank } from '../banks/ComponentBank';
import { EncodedEntity, EntityEncoderComponent } from './EntityEncoderComponent';

export interface EntityEncoderBankOptions {
  type: string;
}

export class EntityEncoderBank<T = any> extends ComponentBank<EntityEncoderComponent<T>> {
  constructor(protected options: EntityEncoderBankOptions) {
    super();
  }

  getEncoder(version?: number): EntityEncoderComponent<T> {
    if (!version) {
      return _.chain(this.getItems()).orderBy(['version'], ['desc']).first().value() as EntityEncoderComponent<T>;
    }

    return this.getItems().find((e) => e.version === version) as EntityEncoderComponent<T>;
  }

  encode(entity: T, throws = true): EncodedEntity | null {
    const encoder = this.getEncoder();
    if (!encoder) {
      if (throws) {
        throw new Error(`There is no encoder registered for entity: [${this.options.type}]`);
      }
      return null;
    }
    return encoder.encode(entity);
  }

  decode(entity: EncodedEntity): Promise<T> {
    if (entity.type !== this.options.type) {
      throw new Error(
        `Entity of type: ${entity.type} cannot be decoded using this entity definition (${this.options.type})`
      );
    }

    const encoder = this.getEncoder(entity.version);
    if (!encoder) {
      throw new Error(
        `There is no encoder registered for entity: [${this.options.type}] with version: [${entity.version}]`
      );
    }
    return encoder.decode(entity);
  }
}
