import * as React from 'react';
import styled from '@emotion/styled';
import { inject } from '../../inversify.config';
import { LayerDirective } from '../../stores/layer/LayerDirective';
import { ComboBoxStore2 } from '../../stores/combo2/ComboBoxStore2';
import { SmartPositionWidget } from '../combo/SmartPositionWidget';
import { FloatingPanelWidget } from '../../widgets/floating/FloatingPanelWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { ComboBoxDirective } from '../../stores/combo2/ComboBoxDirective';
import { FloatingPanelButtonWidget } from '../../widgets/floating/FloatingPanelButtonWidget';

export class ComboBox2Layer extends LayerDirective {
  @inject(ComboBoxStore2)
  accessor comboBoxStore: ComboBoxStore2;

  show() {
    return !!this.comboBoxStore.directive;
  }

  getLayerContent(): React.JSX.Element {
    if (this.comboBoxStore.directive) {
      return <ComboBoxWrapper directive={this.comboBoxStore.directive} />;
    }
  }

  layerWillHide() {
    this.comboBoxStore.directive?.dismiss();
    return true;
  }
}

export interface ComboBoxWrapperProps {
  directive: ComboBoxDirective;
}

export const ComboBoxWrapper: React.FC<ComboBoxWrapperProps> = (props) => {
  return (
    <S.Container>
      <SmartPositionWidget position={props.directive.getPosition()}>
        <FloatingPanelWidget center={false}>
          <S.Container>
            {props.directive.title ? <S.Title>{props.directive.title}</S.Title> : null}
            {props.directive.getContent()}
            {props.directive.buttons.length > 0 ? (
              <S.Buttons>
                {props.directive.buttons.map((b) => {
                  return <FloatingPanelButtonWidget btn={b} key={b.label} />;
                })}
              </S.Buttons>
            ) : null}
          </S.Container>
        </FloatingPanelWidget>
      </SmartPositionWidget>
    </S.Container>
  );
};
namespace S {
  export const Container = styled.div`
    padding: 5px;
  `;

  export const Buttons = styled.div`
    padding-top: 5px;
  `;

  export const Title = themed.div`
    color: ${(p) => p.theme.combobox.text};
    font-size: 15px;
    font-weight: 500;
    padding: 5px;
    padding-bottom: 10px;
  `;
}
