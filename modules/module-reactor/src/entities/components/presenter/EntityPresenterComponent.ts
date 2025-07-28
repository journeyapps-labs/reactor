import { EntityDefinitionComponent } from '../../EntityDefinitionComponent';
import { AbstractPresenterContext } from './AbstractPresenterContext';

export enum EntityPresenterComponentRenderType {
  TREE = 'tree'
}

export interface EntityPresenterComponentOptions {
  label: string;
}

export interface SelectEntityListener<T> {
  selectEntity: (entity: T) => any;
}

export interface EntityPresenterListener<Context extends AbstractPresenterContext> {
  contextGenerated?: (context: Context) => void;
}

export abstract class EntityPresenterComponent<
  T extends any = any,
  PresenterContext extends AbstractPresenterContext<T> = AbstractPresenterContext<T>
> extends EntityDefinitionComponent<EntityPresenterListener<PresenterContext>> {
  static TYPE = 'presenter';

  constructor(
    public renderType: EntityPresenterComponentRenderType,
    protected options: EntityPresenterComponentOptions
  ) {
    super(EntityPresenterComponent.TYPE);
  }

  get label() {
    return this.options.label;
  }

  protected abstract _generateContext(): PresenterContext;

  generateContext(): PresenterContext {
    const context = this._generateContext();
    this.iterateListeners((l) => l.contextGenerated?.(context));
    return context;
  }
}
