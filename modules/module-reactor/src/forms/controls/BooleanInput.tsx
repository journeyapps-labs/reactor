import * as React from 'react';
import { useEffect } from 'react';
import { FormInputOptions, FormInputRenderOptions } from '../FormInput';
import { ControlInput, ControlInputGenerics } from './ControlInput';
import { BooleanControl } from '../../controls/BooleanControl';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { useForceUpdate } from '../../hooks/useForceUpdate';

export interface BooleanInputOptions extends FormInputOptions {
  renderWithLabel?: boolean;
}

export class BooleanInput extends ControlInput<
  {
    OPTIONS: BooleanInputOptions;
  } & ControlInputGenerics<boolean>
> {
  constructor(options: BooleanInputOptions) {
    super(
      options,
      new BooleanControl({
        initialValue: options.value
      })
    );
  }

  renderInputWidget(options: FormInputRenderOptions): React.JSX.Element {
    if (this.options.renderWithLabel) {
      return <BooleanInputWrapperWidget input={this} />;
    }
    return super.renderInputWidget(options);
  }
}

export interface BooleanInputWrapperWidgetProps {
  input: BooleanInput;
}

export const BooleanInputWrapperWidget: React.FC<BooleanInputWrapperWidgetProps> = (props) => {
  const { input } = props;
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    return props.input.registerListener({
      optionsUpdated: () => {
        forceUpdate();
      }
    });
  }, []);
  if (!input.options.visible) {
    return null;
  }
  return (
    <S.Container disabled={input.options.disabled}>
      {(input.control as BooleanControl).representAsCheckbox({
        label: input.options.label,
        disabled: input.options.disabled
      })}
      {input.options.desc ? <S.Desc>{input.options.desc}</S.Desc> : null}
    </S.Container>
  );
};

namespace S {
  export const Desc = styled.p`
    color: ${(p) => p.theme.forms.description};
    font-size: 12px;
    padding-top: 3px;
  `;

  export const Container = styled.div<{ disabled: boolean }>`
    ${(p) => (p.disabled ? `opacity: 0.5; pointer-events: none;` : '')};
  `;
}
