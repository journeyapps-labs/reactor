import React from 'react';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { ImageMedia } from './ImageMedia';
import { ImageMediaPanelWidget } from './ImageMediaPanelWidget';
import { AbstractMediaPanelFactory, AbstractMediaPanelModel } from '../../AbstractMediaPanelFactory';

export class ImageMediaPanelModel extends AbstractMediaPanelModel<ImageMedia> {
  static TYPE = 'asset/image';

  constructor(media: ImageMedia) {
    super(ImageMediaPanelModel.TYPE, media);
  }
}

export class ImageMediaPanelFactory extends AbstractMediaPanelFactory<ImageMediaPanelModel> {
  constructor() {
    super({
      type: ImageMediaPanelModel.TYPE,
      name: 'Image viewer',
      icon: 'images'
    });
  }

  protected _generateModel(): ImageMediaPanelModel {
    return new ImageMediaPanelModel(null);
  }

  generateMediaPanel(event: WorkspaceModelFactoryEvent<ImageMediaPanelModel>): React.JSX.Element {
    return <ImageMediaPanelWidget key={event.model.id} asset={event.model.asset} />;
  }
}
