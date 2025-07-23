import * as React from 'react';
import { Input } from '../../../widgets';
import { FormInputRenderOptions } from '../../FormInput';
import { AbstractTextInput, AbstractTextInputOptions, TextInputFormGenerics } from './AbstractTextInput';

export enum TextInputType {
  TEXT = 'text',
  PASSWORD = 'password'
}

export interface TextInputOptions extends AbstractTextInputOptions {
  inputType?: TextInputType;
}

export class TextInput extends AbstractTextInput<
  {
    OPTIONS: TextInputOptions;
  } & TextInputFormGenerics
> {
  renderControl(options: FormInputRenderOptions): React.JSX.Element {
    return (
      <Input
        data-1p-ignore="true"
        type={this.options.inputType || TextInputType.TEXT}
        autoComplete="off"
        name={this.name}
        value={this.value || ''}
        onChange={(event) => {
          this.setValue(event.target.value);
        }}
      />
    );
  }
}
