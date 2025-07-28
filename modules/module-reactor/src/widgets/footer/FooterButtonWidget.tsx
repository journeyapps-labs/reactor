import * as React from 'react';
import { Btn } from '../../definitions/common';
import { observer } from 'mobx-react';
import { ButtonWidgetIcon, useSubmit } from '../forms/buttons';
import { AttentionWrapperWidget } from '../guide/AttentionWrapperWidget';
import { useRef } from 'react';
import { ButtonComponentSelection, ReactorComponentType } from '../../stores/guide/selections/common';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { setupTooltipProps } from '../info/tooltips';

namespace S {
  export const ButtonLabel = styled.div`
    font-size: 14px;
    white-space: nowrap;
  `;

  export const ButtonIcon = styled.div`
    font-size: 18px;
    margin-right: 10px;
    display: flex;
    align-items: center;

    img,
    svg {
      width: 100%;
      max-width: 22px;
      max-height: 22px;
    }
  `;

  export const ButtonContainer = themed.div<{ attention: boolean }>`
    cursor: pointer;
    user-select: none;
    align-self: stretch;
    display: flex;
    align-items: center;
    border: solid 1px transparent;
    border-left: solid 1px ${(p) => p.theme.panels.trayBackground};
    ${(p) => (p.attention ? `border: solid 1px ${p.theme.guide.accent}` : ``)};
    padding-left: 15px;
    padding-right: 15px;
    color: ${(p) => p.theme.text.secondary};
    opacity: ${(p) => (p.attention ? 1 : 0.6)};

    &:hover{
      opacity: 1.0;
    }
  `;
}

export const FooterButtonWidget: React.FC<Btn & { className?: string }> = observer((props) => {
  const controls = useSubmit(props);
  const ref = useRef(null);
  return (
    <AttentionWrapperWidget<ButtonComponentSelection>
      selection={{
        label: props.label
      }}
      forwardRef={ref}
      activated={(selection) => {
        return (
          <S.ButtonContainer
            attention={!!selection}
            ref={ref}
            className={props.className}
            {...setupTooltipProps(props)}
            onClick={(event) => {
              event.persist();
              event.stopPropagation();
              controls.action(event);
            }}
          >
            {props.icon ? (
              <S.ButtonIcon>
                <ButtonWidgetIcon icon={props.icon} loading={controls.blocking} />
              </S.ButtonIcon>
            ) : null}
            <S.ButtonLabel>{props.label}</S.ButtonLabel>
          </S.ButtonContainer>
        );
      }}
      type={ReactorComponentType.FOOTER_BUTTON}
    />
  );
});
