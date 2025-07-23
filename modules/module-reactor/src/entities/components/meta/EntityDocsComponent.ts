import { EntityDefinitionComponent } from '../../EntityDefinitionComponent';

export interface EntityDocsComponentOptions<T> {
  label: string;
  getDocLink: (entity: T) => string | null;
}

export class EntityDocsComponent<T> extends EntityDefinitionComponent {
  static TYPE = 'docs';

  constructor(protected options: EntityDocsComponentOptions<T>) {
    super(EntityDocsComponent.TYPE);
  }

  get label() {
    return this.options.label;
  }

  getDocs(entity: T) {
    return this.options.getDocLink(entity) || null;
  }
}
