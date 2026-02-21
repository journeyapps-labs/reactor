import * as React from 'react';
import { ControlInput, ControlInputGenerics } from './ControlInput';
import { FormInputOptions, FormInputRenderOptions } from '../FormInput';
import { FileControl } from '../../controls/FileControl';
import styled from '@emotion/styled';
import { PanelButtonMode, PanelButtonWidget } from '../../widgets/forms/PanelButtonWidget';
import { DialogStore } from '../../stores/DialogStore';
import { inject } from '../../inversify.config';
import { InputDialogType } from '../../layers/dialog/InputDialogWidget';

export interface FileInputOptions extends FormInputOptions<File> {
  allowPaste?: boolean;
}

export class FileInput extends ControlInput<ControlInputGenerics<File> & { OPTIONS: FileInputOptions }> {
  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  constructor(options: FileInputOptions) {
    super(options, new FileControl({ initialValue: options.value }));
  }

  renderControl(options: FormInputRenderOptions): React.JSX.Element {
    if (this.options.allowPaste && !this.value) {
      return (
        <S.ButtonsGroup>
          {super.renderControl(options)}
          <PanelButtonWidget
            mode={PanelButtonMode.LINK}
            label="or enter manually"
            action={async () => {
              const data = await this.dialogStore.showInputDialog({
                title: `Enter data for ${this.label}`,
                fieldType: InputDialogType.TEXT_AREA
              });
              if (data) {
                const file = new File([data], 'manually entered data');
                this.setValue(file);
              }
            }}
          />
        </S.ButtonsGroup>
      );
    }
    return super.renderControl(options);
  }
}

namespace S {
  export const ButtonsGroup = styled.div`
    display: flex;
    align-items: center;
  `;
}
