import { AbstractMediaType, GenerateMediaOptions } from '../../AbstractMediaType';
import { ImageMediaPanelFactory, ImageMediaPanelModel } from './ImageMediaPanelFactory';
import { ImageMedia } from './ImageMedia';
import { ReactorPanelFactory } from '../../../stores/workspace/react-workspaces/ReactorPanelFactory';

/**
 * String in this case is a base64 string
 */

export class ImageMediaType extends AbstractMediaType<ImageMedia> {
  generatePanelFactory(): ReactorPanelFactory {
    return new ImageMediaPanelFactory();
  }

  generateMedia(options: GenerateMediaOptions): ImageMedia {
    return new ImageMedia({
      ...options,
      type: this
    });
  }

  generateModel(media: ImageMedia): ImageMediaPanelModel {
    return new ImageMediaPanelModel(media);
  }
}
