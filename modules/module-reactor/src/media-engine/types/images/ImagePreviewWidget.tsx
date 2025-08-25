import * as React from 'react';
import { useEffect, useState } from 'react';
import { ImageMedia } from './ImageMedia';
import { styled } from '../../../stores/themes/reactor-theme-fragment';

export interface ImagePreviewWidgetProps {
  media: ImageMedia;
  width: number;
  height: number;
  className?: any;
}
export const ImagePreviewWidget: React.FC<ImagePreviewWidgetProps> = (props) => {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    props.media
      .getPreview({
        maxWidth: props.width,
        maxHeight: props.height
      })
      .then((url) => {
        setUrl(url);
      });
  }, [props.media]);
  if (!url) {
    return null;
  }
  return <S.Container className={props.className} src={url} />;
};
namespace S {
  export const Container = styled.img``;
}
