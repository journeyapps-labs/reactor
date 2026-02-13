import { EntityDescriberComponent } from './EntityDescriberComponent';
import type { EntityDefinition } from '../../EntityDefinition';
import { PreferredSetBank } from '../banks/PreferredSetBank';

export class EntityDescriberBank<T = any> extends PreferredSetBank<EntityDescriberComponent<T>> {
  constructor(private definition: EntityDefinition<T>) {
    super({
      setting: {
        key: `/entities/${definition.type}/visual/preferred-describer`,
        serializeID: 'v1',
        name: `${definition.label}: Description`,
        description: 'Preferred description style used across entity presenters',
        category: `Entities: ${definition.category}`
      },
      getOption: (describer) => {
        return {
          key: describer.label,
          label: describer.label
        };
      }
    });
  }

  register(describer: EntityDescriberComponent<T>) {
    return super.register(describer);
  }

  getDescribers(): EntityDescriberComponent<T>[] {
    return this.getItems();
  }

  getPreferredDescriber(): EntityDescriberComponent<T> | null {
    return this.getPreferred();
  }

  protected onPreferredChanged(describer: EntityDescriberComponent<T>) {
    describer.setPreferred();
  }

  protected onItemRegistered(describer: EntityDescriberComponent<T>) {
    describer.registerListener({
      preferred: () => {
        this.setPreferred(describer);
      }
    });
  }
}
