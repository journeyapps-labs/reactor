import { EntityDefinitionComponent } from '../../EntityDefinitionComponent';

export interface EncodedEntity<T extends {} = {}> {
  type: string;
  version: number;
  id: string;
  encoded: T;
}

export interface EntityEncoderComponentOptions {
  version: number;
}

export abstract class EntityEncoderComponent<
  Decoded extends any = any,
  Encoded extends {} = {}
> extends EntityDefinitionComponent {
  static TYPE = 'encoder';

  constructor(protected options: EntityEncoderComponentOptions = { version: 1 }) {
    super(EntityEncoderComponent.TYPE);
  }

  get version() {
    return this.options.version;
  }

  encode(entity: Decoded): EncodedEntity<Encoded> {
    return {
      encoded: this.doEncode(entity),
      type: this.definition.type,
      version: this.version,
      id: this.definition.getEntityUID(entity)
    };
  }

  decode(entity: EncodedEntity<Encoded>): Promise<Decoded> {
    return this.doDecode(entity.encoded);
  }

  protected abstract doEncode(entity: Decoded): Encoded;

  protected abstract doDecode(entity: Encoded): Promise<Decoded>;
}
