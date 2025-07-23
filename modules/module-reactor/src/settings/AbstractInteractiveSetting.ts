import { AbstractSetting, AbstractSettingOptions } from './AbstractSetting';

export interface AbstractInteractiveControlOptions extends AbstractSettingOptions {
  name?: string;
  description?: string;
  category?: string;
}

/**
 * @deprecated
 */
export abstract class AbstractInteractiveSetting<
  T extends AbstractInteractiveControlOptions = AbstractInteractiveControlOptions
> extends AbstractSetting<T> {
  abstract generateControl(): React.JSX.Element;
}
