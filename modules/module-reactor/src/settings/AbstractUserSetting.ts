import { AbstractInteractiveControlOptions, AbstractInteractiveSetting } from './AbstractInteractiveSetting';
import { AbstractValueControl } from '../controls/AbstractValueControl';

export abstract class AbstractUserSetting<
  V extends AbstractValueControl = AbstractValueControl,
  T extends AbstractInteractiveControlOptions = AbstractInteractiveControlOptions
> extends AbstractInteractiveSetting<T> {
  constructor(
    options: T,
    protected control: V
  ) {
    super(options);
  }

  generateControl(): React.JSX.Element {
    return this.control.representAsControl();
  }
}
