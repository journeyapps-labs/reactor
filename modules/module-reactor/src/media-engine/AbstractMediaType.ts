import * as _ from 'lodash';
import { AbstractMedia, AbstractMediaOptions } from './AbstractMedia';
import { WorkspaceStore } from '../stores/workspace/WorkspaceStore';
import { inject } from '../inversify.config';
import { ReactorIcon } from '../widgets/icons/IconWidget';
import { ReactorPanelFactory } from '../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../stores/workspace/react-workspaces/ReactorPanelModel';

export interface AbstractMediaTypeOptions {
  mime: string;
  extensions: string[];
  displayName: string;
  icon: ReactorIcon;
}

export type GenerateMediaOptions = Omit<AbstractMediaOptions, 'type'>;

export abstract class AbstractMediaType<T extends AbstractMedia = AbstractMedia> {
  readonly options: AbstractMediaTypeOptions;

  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  constructor(options: AbstractMediaTypeOptions) {
    this.options = options;
  }

  matches(options: { path: string }): boolean {
    return _.some(this.options.extensions, (extension) => {
      return options.path.endsWith(extension);
    });
  }

  abstract generatePanelFactory(): ReactorPanelFactory;

  abstract generateModel(media: T): ReactorPanelModel;

  abstract generateMedia(options: GenerateMediaOptions): T;

  openMedia(media: T) {
    const model = this.generateModel(media);
    this.workspaceStore.addModel(model);
  }
}
