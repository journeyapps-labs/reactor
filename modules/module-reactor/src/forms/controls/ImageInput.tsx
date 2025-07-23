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
      <UploadImagePreviewWidget
        media={this.value}
        onUpload={(media) => {
          this.setValue(media);
        }}
      />
    );
  }
}

namespace S {
  export const Text = styled.div`
    position: absolute;
    color: ${(p) => p.theme.forms.inputForeground};
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 14px;
    font-family: 'Open Sans';
  `;

  export const Preview = styled.div`
    width: 200px;
    height: 200px;
    border-radius: 5px;
    position: relative;
    background: ${(p) => p.theme.forms.inputBackground};
    cursor: pointer;
  `;
}
