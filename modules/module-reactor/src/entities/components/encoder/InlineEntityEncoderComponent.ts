import { EntityEncoderComponent, EntityEncoderComponentOptions } from './EntityEncoderComponent';

export interface InlineEntityEncoderComponentOptions<Decoded, Encoded> extends EntityEncoderComponentOptions {
  encode: (e: Decoded) => Encoded;
  decode: (e: Encoded) => Promise<Decoded>;
}

export class InlineEntityEncoderComponent<
  Decoded extends any = any,
  Encoded extends {} = {}
> extends EntityEncoderComponent<Decoded, Encoded> {
  constructor(protected options2: InlineEntityEncoderComponentOptions<Decoded, Encoded>) {
    super({
      version: options2.version
    });
  }

  protected doDecode(entity: Encoded): Promise<Decoded> {
    return this.options2.decode(entity);
  }

  protected doEncode(entity: Decoded): Encoded {
    return this.options2.encode(entity);
  }
}
