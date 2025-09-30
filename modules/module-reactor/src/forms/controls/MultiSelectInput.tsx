import { FormInput, FormInputGenerics, FormInputOptions, FormInputRenderOptions } from '../FormInput';
import { CheckboxLabelWidget } from '../../widgets';
import * as React from 'react';
import * as _ from 'lodash';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { useEffect } from 'react';

export interface MultiSelectInputOptions extends FormInputOptions<string[]> {
  options: Record<string, string>;
  tooltip?: string;
}

export class MultiSelectInput extends FormInput<
  {
    OPTIONS: MultiSelectInputOptions;
  } & FormInputGenerics
> {
  renderControl(options: FormInputRenderOptions): React.JSX.Element {
    return <MultiSelectInputWidget input={this} />;
  }
}

export interface MultiSelectInputWidgetProps {
  input: MultiSelectInput;
}

export const MultiSelectInputWidget: React.FC<MultiSelectInputWidgetProps> = (props) => {
  const { input } = props;

  const forceUpdate = useForceUpdate();
  useEffect(() => {
    return input.registerListener({
      valueChanged: () => {
        forceUpdate();
      },
      optionsUpdated: () => {
        forceUpdate();
      }
    });
  }, []);

  return (
    <div>
      {_.map(input.options.options, (option, key) => {
        return (
          <CheckboxLabelWidget
            label={option}
            checked={input.value.indexOf(key) !== -1}
            onChange={(checked) => {
              if (checked) {
                input.setValue([...input.value, key]);
              } else {
                input.setValue([...input.value.filter((v) => v !== key)]);
              }
            }}
          />
        );
      })}
    </div>
  );
};
