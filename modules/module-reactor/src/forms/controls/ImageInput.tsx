import * as React from 'react';
import { FormInput, FormInputGenerics, FormInputRenderOptions } from '../FormInput';
import { ImageMedia, MediaEngine } from '../../media-engine';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { inject } from '../../inversify.config';
import { UploadImagePreviewWidget } from '../../media-engine/types/images/UploadImagePreviewWidget';

interface ImageInputG extends FormInputGenerics {
  VALUE: ImageMedia;
}

export class ImageInput extends FormInput<ImageInputG> {
  @inject(MediaEngine)
  accessor mediaEngine: MediaEngine;

  renderControl(options: FormInputRenderOptions): React.JSX.Element {
    return (
      <S.Preview
        media={this.value}
        onUpload={(media) => {
          this.setValue(media);
        }}
        clear={() => {
          this.setValue(null);
        }}
      />
    );
  }
}

namespace S {
  export const Preview = styled(UploadImagePreviewWidget)`
    border: solid 1px ${(p) => p.theme.forms.inputBorder};
    overflow: hidden;
  `;
}
