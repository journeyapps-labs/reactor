import { FormInput, FormInputGenerics, FormInputOptions } from '../../FormInput';

export interface AbstractTextInputOptions extends FormInputOptions<string> {
  validator?: (value: string) => boolean | string;
}

export interface TextInputFormGenerics extends FormInputGenerics {
  OPTIONS: AbstractTextInputOptions;
  VALUE: string;
}

export abstract class AbstractTextInput<
  Generics extends TextInputFormGenerics = TextInputFormGenerics
> extends FormInput<Generics> {
  setValue(value: string | null) {
    if (value?.trim() === '') {
      value = null;
    }
    super.setValue(value);

    if (this.options.validator) {
      if (!this.options.required && !value) {
        return;
      }
      let validated = this.options.validator(value);
      if (validated !== true) {
        this.setError((validated as string) || 'Not valid');
      }
    }
  }
}
