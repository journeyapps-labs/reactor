import { BaseListener, BaseObserver, Disposable } from '@journeyapps-labs/lib-reactor-utils';

export interface AbstractSerializerListener extends BaseListener {
  gotExternalChanges: () => any;
}

export abstract class AbstractSerializer<T = object>
  extends BaseObserver<AbstractSerializerListener>
  implements Disposable
{
  abstract serialize(data: T): Promise<boolean>;

  abstract deserialize(): Promise<T | false>;

  abstract dispose(): any;
}
