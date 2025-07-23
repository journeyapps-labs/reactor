import * as React from 'react';
import { AbstractControl, RepresentAsComboBoxItemsEvent, RepresentAsControlOptions } from './AbstractControl';
import { ComboBoxItem } from '../stores/combo/ComboBoxDirectives';
import { Btn } from '../definitions/common';
import { PanelButtonWidget } from '../widgets/forms/PanelButtonWidget';
import * as _ from 'lodash';
import { LayoutContextSize } from '../layout';
import { FloatingPanelButtonWidget } from '../widgets/floating/FloatingPanelButtonWidget';

export interface ButtonControlOptions {
  btn: Btn | (() => Btn);
}

export class ButtonControl implements AbstractControl {
  constructor(protected options: ButtonControlOptions) {}

  representAsBtn(): Btn {
    if (_.isFunction(this.options.btn)) {
      return this.options.btn();
    }
    return this.options.btn;
  }

  representAsComboBoxItems(options: RepresentAsComboBoxItemsEvent | undefined): ComboBoxItem[] {
    const btn = this.representAsBtn();
    return [
      {
        title: options.label || btn.label,
        action: btn.action,
        icon: btn.icon,
        key: btn.label
      }
    ];
  }

  representAsControl(options: RepresentAsControlOptions): React.JSX.Element {
    if (options?.size === LayoutContextSize.SMALL) {
      return <FloatingPanelButtonWidget btn={this.representAsBtn()} />;
    }
    return <PanelButtonWidget {...this.representAsBtn()} />;
  }
}
