import * as React from 'react';
import { v4 } from 'uuid';
import { selectFile } from '@journeyapps-labs/lib-reactor-utils';
import { ImageMedia } from './ImageMedia';
import { MediaEngine } from '../../MediaEngine';
import { ioc } from '../../../inversify.config';
import { ImagePreviewWidget } from './ImagePreviewWidget';
import { styled } from '../../../stores/themes/reactor-theme-fragment';

export interface UploadImagePreviewWidgetProps {
  onUpload: (media: ImageMedia) => Promise<void> | void;
  media?: ImageMedia;
  mimeTypes?: string[];
}

export const UploadImagePreviewWidget: React.FC<UploadImagePreviewWidgetProps> = (props) => {
  return (
    <S.Preview
      onClick={async () => {
        const file = await selectFile({ mimeTypes: props.mimeTypes });

        const type = ioc.get(MediaEngine).getMediaType({
          path: file.name
        });

        if (!type) {
          return;
        }
        const media = type.generateMedia({
          name: file.name,
          uid: v4(),
          content: file
        }) as ImageMedia;
        if (media) {
          props.onUpload(media);
        }
      }}
    >
      {props.media ? (
        <ImagePreviewWidget width={200} height={200} media={props.media} />
      ) : (
        <S.Text>Select image</S.Text>
      )}
    </S.Preview>
  );
};

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
