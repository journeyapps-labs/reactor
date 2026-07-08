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
import { IconWidget } from '../../widgets/icons/IconWidget';
import { REACTOR_MOBILE_MEDIA_QUERY } from '../../hooks/useReactorViewportMode';

export class ComboBox2Layer extends LayerDirective {
  @inject(ComboBoxStore2)
  accessor comboBoxStore: ComboBoxStore2;

  show() {
    return this.comboBoxStore.directives.size > 0;
  }

  getLayerContent(): React.JSX.Element {
    const directives = Array.from(this.comboBoxStore.directives.values());
    if (directives.length > 0) {
      return (
        <>
          {directives.map((directive, index) => (
            <ComboBoxWrapper directive={directive} key={`combo2-${directive.id}`} />
          ))}
        </>
      );
    }
  }

  layerWillHide() {
    Array.from(this.comboBoxStore.directives.values()).forEach((directive) => directive.dismiss());
    return true;
  }

  animate() {
    return false;
  }
}

export interface ComboBoxWrapperProps {
  directive: ComboBoxDirective;
}

export const ComboBoxWrapper: React.FC<ComboBoxWrapperProps> = (props) => {
  return (
    <S.Container>
      <S.MobileBackdrop show={props.directive.centerOnMobile()} />
      <SmartPositionWidget position={props.directive.getPosition()} centerOnMobile={props.directive.centerOnMobile()}>
        <FloatingPanelWidget center={false} scaleInOnMobile={props.directive.centerOnMobile()}>
          <S.Container>
            <S.MobileClose
              show={props.directive.centerOnMobile()}
              onClick={(event) => {
                event.stopPropagation();
                props.directive.dismiss();
              }}
            >
              <IconWidget icon="times" />
            </S.MobileClose>
            {props.directive.title ? (
              <S.Title hasClose={props.directive.centerOnMobile()}>{props.directive.title}</S.Title>
            ) : null}
            {props.directive.subtitle ? <S.Subtitle>{props.directive.subtitle}</S.Subtitle> : null}
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
    display: flex;
    flex-direction: column;
    min-height: 0;
    position: relative;
  `;

  export const MobileBackdrop = styled.div<{ show: boolean }>`
    display: none;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      display: ${(p) => (p.show ? 'block' : 'none')};
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }
  `;

  export const MobileClose = themed.button<{ show: boolean }>`
    display: none;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      display: ${(p) => (p.show ? 'flex' : 'none')};
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 8px;
      top: 8px;
      width: 38px;
      height: 38px;
      border: 0;
      border-radius: 4px;
      color: ${(p) => p.theme.combobox.text};
      background: transparent;
      font-size: 20px;
      z-index: 1;
    }
  `;

  export const Buttons = styled.div`
    padding-top: 5px;
  `;

  export const Title = themed.div<{ hasClose?: boolean }>`
    color: ${(p) => p.theme.combobox.text};
    font-size: 15px;
    font-weight: 500;
    padding: 5px;
    padding-bottom: 10px;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      font-size: 22px;
      padding: 14px ${(p) => (p.hasClose ? '52px' : '14px')} 4px 14px;
    }
  `;

  export const Subtitle = themed.div`
    color: ${(p) => p.theme.text.secondary};
    font-size: 12px;
    padding: 5px;
    padding-top: 0px;
    padding-bottom: 8px;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      font-size: 16px;
      padding: 0 14px 12px 14px;
    }
  `;
}
