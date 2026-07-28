import * as React from 'react';
import { TextArea } from '../../../widgets/forms/textAreas';
import { FormInputRenderOptions } from '../../FormInput';
import { AbstractTextInput } from './AbstractTextInput';

export class TextAreaInput extends AbstractTextInput {
  renderControl(options: FormInputRenderOptions): React.JSX.Element {
    return (
      <TextArea
        data-1p-ignore="true"
        autoComplete="off"
        name={this.name}
        placeholder={this.placeholder}
        value={this.value || ''}
        onChange={(event) => {
          this.setValue(event.target.value);
        }}
      />
    );
  }
}
