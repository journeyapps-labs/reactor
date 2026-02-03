import { GuideStep, GuideStepOptions } from './GuideStep';
import { IReactionDisposer, autorun } from 'mobx';
import { ReactorComponentSelections } from '../selections/common';

export interface ResolverGuideStepOptions<
  E extends ReactorComponentSelections = ReactorComponentSelections
> extends GuideStepOptions<E> {
  isResolved: () => boolean;
}

export class ResolverGuideStep<E extends ReactorComponentSelections = ReactorComponentSelections> extends GuideStep<
  E,
  ResolverGuideStepOptions<E>
> {
  private reactionDisposer: IReactionDisposer;

  activated() {
    if (!!this.options.isResolved()) {
      this.complete();
      return;
    }
    super.activated();
    this.reactionDisposer = autorun(() => {
      try {
        if (!!this.options.isResolved()) {
          this.complete();
        }
      } catch (ex) {
        return false;
      }
    });
  }

  deactivated() {
    super.deactivated();
    this.reactionDisposer?.();
  }
}
