import { observable } from 'mobx';
import { ReactorIcon } from '../../widgets/icons/IconWidget';
import { MouseEventHandler } from 'react';
import * as _ from 'lodash';

export interface ReportValueParams {
  value: string;
  color?: string;
  icon?: {
    name: ReactorIcon;
    color: string;
    spin?: boolean;
  };
  onClick?: MouseEventHandler<any>;
}

export interface VisorMetadataInstance extends ReportValueParams {
  label: string;
}

export interface VisorMetadataOptions {
  key: string;
  displayName: string;
  displayDefault: boolean;
  configurationName?: string;
}

export abstract class VisorMetadata {
  options: VisorMetadataOptions;

  @observable
  accessor currentInstance: VisorMetadataInstance;

  constructor(options: VisorMetadataOptions) {
    this.options = options;
    this.currentInstance = null;
  }

  get configurationName() {
    return this.options.configurationName || this.options.displayName;
  }

  abstract init();

  report(instance: VisorMetadataInstance) {
    this.currentInstance = instance;
  }

  clearValue() {
    this.currentInstance = null;
  }

  reportValue(params: ReportValueParams) {
    _.defer(() => {
      if (
        !!this.currentInstance &&
        _.isEqual(
          _.pick(params, ['value', 'icon', 'onClick']),
          _.pick(this.currentInstance, ['value', 'icon', 'onClick'])
        )
      ) {
        return;
      }
      this.report({
        label: this.options.displayName,
        ...params
      });
    });
  }
}
