import React from 'react';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { makeObservable, observable } from 'mobx';
import { Observer } from 'mobx-react';
import { AbstractMedia } from './AbstractMedia';
import { ReactorPanelModel } from '../stores/workspace/react-workspaces/ReactorPanelModel';
import { ioc } from '../inversify.config';
import { MediaEngine } from './MediaEngine';
import {
  AbstractReactorPanelFactoryOptions,
  ReactorPanelFactory
} from '../stores/workspace/react-workspaces/ReactorPanelFactory';
import { LoadingPanelWidget } from '../widgets/panel/panel/LoadingPanelWidget';
import { ReactorEntityCategories } from '../entities-reactor/ReactorEntities';

export class AbstractMediaPanelModel<T extends AbstractMedia = AbstractMedia> extends ReactorPanelModel {
  @observable
  accessor asset: T;
  assetUID: string;

  constructor(type: string, media: T) {
    super(type);
    this.setExpand(true, true);
    this.asset = media;
    this.assetUID = media?.getOptions().uid;
  }

  toArray() {
    return {
      ...super.toArray(),
      assetUID: this.assetUID
    };
  }

  fromArray(payload: ReturnType<this['toArray']>, engine): void {
    super.fromArray(payload, engine);
    this.assetUID = payload.assetUID;
    ioc
      .get(MediaEngine)
      .loadMediaForID<T>(payload.assetUID)
      .then((asset) => {
        this.asset = asset;
      });
  }
}

export abstract class AbstractMediaPanelFactory<
  T extends AbstractMediaPanelModel
> extends ReactorPanelFactory<AbstractMediaPanelModel> {
  constructor(
    options: Omit<AbstractReactorPanelFactoryOptions, 'category' | 'fullscreen' | 'isMultiple' | 'allowManualCreation'>
  ) {
    super({
      fullscreen: true,
      isMultiple: true,
      category: ReactorEntityCategories.CORE,
      allowManualCreation: false,
      ...options
    });
  }

  abstract generateMediaPanel(event: WorkspaceModelFactoryEvent<T>): React.JSX.Element;

  matchesModel(newModel: T, existingModel: T): boolean {
    return newModel.assetUID === existingModel.assetUID;
  }

  protected generatePanelContent(event: WorkspaceModelFactoryEvent<T>): React.JSX.Element {
    return (
      <Observer
        render={() => {
          return (
            <LoadingPanelWidget
              loading={!event.model.asset}
              children={() => {
                return this.generateMediaPanel(event);
              }}
            />
          );
        }}
      />
    );
  }
}
