import * as React from 'react';
import { AbstractInteractiveControlOptions } from './AbstractInteractiveSetting';
import { autorun, makeObservable, observable } from 'mobx';
import { inject } from '../inversify.config';
import styled from '@emotion/styled';
import { ThemeStore } from '../stores/themes/ThemeStore';
import { AbstractUserSetting } from './AbstractUserSetting';
import { BooleanControl } from '../controls/BooleanControl';

export interface BooleanControlOptions extends AbstractInteractiveControlOptions {
  checked: boolean;
  changed?: (checked: boolean) => any;
}

namespace S {
  export const Wrapper = styled.div`
    display: flex;
  `;
}

export class BooleanSetting extends AbstractUserSetting<BooleanControl, BooleanControlOptions> {
  default: boolean;

  @observable
  accessor checked: boolean;

  @inject(ThemeStore)
  accessor themeStore: ThemeStore;

  constructor(options: BooleanControlOptions) {
    super(
      options,
      new BooleanControl({
        initialValue: !!options.checked
      })
    );
    this.checked = !!options.checked;
    this.default = !!options.checked;
    this.control.registerListener({
      valueChanged: (value) => {
        this.checked = value;
        options.changed?.(value);
        if (this.initialized) {
          this.save();
        }
      }
    });
  }

  setDefault(checked: boolean) {
    this.default = checked;
  }

  setChecked(checked: boolean) {
    this.control.value = checked;
  }

  reset() {
    this.control.value = this.default;
  }

  serialize() {
    return {
      checked: this.control.value
    };
  }

  deserialize(data) {
    this.control.value = data.checked;
  }

  renderAsCheckbox(label?: string) {
    return this.control.representAsCheckbox({
      label
    });
  }

  renderAsToggle() {
    return (
      <S.Wrapper
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {this.control.representAsControl()}
      </S.Wrapper>
    );
  }

  generateControl(): React.JSX.Element {
    return this.renderAsToggle();
  }

  toggle() {
    this.control.toggle();
  }
}
