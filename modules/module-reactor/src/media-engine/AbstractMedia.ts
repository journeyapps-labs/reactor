import { AbstractMediaType } from './AbstractMediaType';

export type AssetContent = ArrayBuffer | File | string | Uint8Array;

export interface AbstractMediaOptions {
  content: AssetContent;
  type: AbstractMediaType;
  name: string;
  uid: string;
}

export class AbstractMedia<OPTIONS extends AbstractMediaOptions = AbstractMediaOptions> {
  protected options: OPTIONS;

  constructor(options: OPTIONS) {
    this.options = options;
  }

  getOptions(): OPTIONS {
    return this.options;
  }

  getType() {
    return this.options.type;
  }

  getSize(): number {
    if (this.options.content instanceof File) {
      return this.options.content.size;
    }
    if (this.options.content instanceof ArrayBuffer) {
      return this.options.content.byteLength;
    }
    if (typeof this.options.content === 'string') {
      new Buffer(this.options.content, 'base64').length;
    }
    return 0;
  }

  open() {
    this.getType().openMedia(this);
  }

  getMB(): number {
    return this.getSize() / (1024 * 1000);
  }

  async toBase64(f?: File): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const file = f || (await this.toFile());
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as any);
      reader.onerror = (error) => reject(error);
    });
  }

  async toFile(): Promise<File> {
    if (this.options.content instanceof File) {
      return this.options.content;
    }
    if (
      this.options.content instanceof ArrayBuffer ||
      typeof this.options.content === 'string' ||
      this.options.content instanceof Uint8Array
    ) {
      const content = await this.toArrayBuffer();
      return new File([content], 'unknown');
    }
    throw new Error('Cant convert asset content to File');
  }

  async toArrayBuffer(): Promise<ArrayBuffer> {
    if (this.options.content instanceof ArrayBuffer) {
      return this.options.content;
    }
    if (this.options.content instanceof Uint8Array) {
      return this.options.content;
    }
    if (this.options.content instanceof File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(this.options.content as File);
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = (error) => reject(error);
      });
    }
    if (typeof this.options.content === 'string') {
      let binary_string = window.atob(this.options.content);
      let len = binary_string.length;
      let bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }
    throw new Error('Cant convert asset content to ArrayBuffer');
  }
}
