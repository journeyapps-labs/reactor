import {
  FormInput,
  FormInputGenerics,
  FormInputOptions,
  FormInputRenderOptions,
  SimplifiedFormInputType
} from '../../FormInput';
import { styled } from '../../../stores/themes/reactor-theme-fragment';
import * as React from 'react';
import { useEffect } from 'react';

export interface GroupInputOptions<T extends {}> extends FormInputOptions<T> {
  inputs?: FormInput[];
  layout?: {
    horizontal: boolean;
    border: boolean;
  };
}

export interface GroupInputGenerics<T> extends FormInputGenerics {
  OPTIONS: GroupInputOptions<T>;
  VALUE: T;
}

const calculateValue = (inputs: FormInput[]) => {
  if (!inputs) {
    return {};
  }
  return inputs.reduce((prev, cur) => {
    prev[cur.name] = cur.value;
    return prev;
  }, {});
};

export class GroupInput<T = {}> extends FormInput<GroupInputGenerics<T>> {
  disposeListeners: () => any;
  private setValueLock: boolean;
  inputs: FormInput[];

  constructor(options: GroupInputOptions<T>) {
    super({
      ...options,
      layout: options.layout || {
        horizontal: true,
        border: false
      }
    });
    this.setValueLock = false;
    this.setInputs(options.inputs || []);
  }

  protected setInputs(inputs: FormInput[]) {
    this.disposeListeners?.();
    this.inputs = inputs;
    this.setValue(calculateValue(inputs) as T);
    const listeners = inputs.map((i) => {
      return i.registerListener({
        valueChanged: () => {
          this.setValueLock = true;
          this.setValue(calculateValue(inputs) as T);
          this.setValueLock = false;
        }
      });
    });
    this.disposeListeners = () => {
      listeners.forEach((l) => l());
    };
    if (this.value) {
      for (let k in this.value) {
        inputs.find((i) => i.name === k)?.setValue(this.value[k]);
      }
    }
  }

  getInput<T extends FormInput>(input: string): T;
  getInput<K extends keyof T, C extends SimplifiedFormInputType<T[K]>>(input: K): C;
  getInput<K extends keyof T, C extends SimplifiedFormInputType<T[K]>>(input: K): C {
    return this.inputs.find((i) => i.name === input) as C;
  }

  setValue(value: GroupInputGenerics<T>['VALUE']) {
    super.setValue(value);
    if (this.setValueLock) {
      return;
    }
    for (let key in value) {
      this.inputs.find((o) => o.name === key).setValue(value[key]);
    }
  }

  dispose() {
    this.disposeListeners();
    this.disposeListeners = null;
  }

  renderInputWidget(options: FormInputRenderOptions): React.JSX.Element {
    if (this.options.layout.border) {
      return <GroupWidget input={this} />;
    }
    return super.renderInputWidget(options);
  }

  renderControl(options: FormInputRenderOptions): React.JSX.Element {
    const items = this.inputs.map((i) => {
      return <React.Fragment key={i.name}>{i.renderInputWidget({ inline: true })}</React.Fragment>;
    });

    return this.options.layout.horizontal ? <S.HContainer>{items}</S.HContainer> : <S.VContainer>{items}</S.VContainer>;
  }
}

export interface GroupWidgetProps {
  input: GroupInput<any>;
}

export const GroupWidget: React.FC<GroupWidgetProps> = (props) => {
  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  useEffect(() => {
    return props.input.registerListener({
      valueChanged: () => {
        forceUpdate();
      },
      optionsUpdated: () => {
        forceUpdate();
      }
    });
  }, []);
  if (!props.input.visible) {
    return null;
  }
  return (
    <S.Entry>
      <S.EntryTop>{props.input.label}</S.EntryTop>
      <S.Display>{props.input.renderControl({ inline: false })}</S.Display>
    </S.Entry>
  );
};

namespace S {
  export const Display = styled.div`
    padding: 10px;
  `;

  export const HContainer = styled.div`
    display: flex;
    align-items: flex-start;
    column-gap: 10px;
  `;
  export const VContainer = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 4px;
  `;

  export const Entry = styled.div`
    border-radius: 4px;
    border: solid 2px ${(p) => p.theme.forms.groupBorder};
    margin-bottom: 3px;
  `;

  export const EntryTop = styled.div`
    display: flex;
    align-items: center;
    background: ${(p) => p.theme.forms.groupBorder};
    color: ${(p) => p.theme.forms.groupLabelForeground};
    padding: 4px;
    padding-left: 10px;
  `;
}
