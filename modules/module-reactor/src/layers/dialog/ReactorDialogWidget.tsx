import * as React from 'react';
import { JSX, useRef } from 'react';
import { useAttention } from '../../widgets/guide/AttentionWrapperWidget';
import { ReactorComponentType } from '../../stores/guide/selections/common';
import { FloatingPanelWidget } from '../../widgets/floating/FloatingPanelWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface ReactorDialogWidgetProps {
  footer?: React.JSX.Element;
  title?: string;
  desc?: string;
  logo?: string;
}

export const ReactorDialogWidget: React.FC<React.PropsWithChildren<ReactorDialogWidgetProps>> = (props) => {
  const ref = useRef(null);
  const selected = useAttention({
    forwardRef: ref,
    type: ReactorComponentType.DIALOG,
    boundsMutator: (bounds) => {
      return {
        ...bounds,
        height: bounds.height + 10
      };
    }
  });
  return (
    <FloatingPanelWidget highlight={!!selected} forwardRef={ref} center={true}>
      <S.Container>
        <S.Header>
          {props.title && <S.Title>{props.title}</S.Title>}
          {props.logo && <S.Logo src={props.logo} />}
          {props.desc && <S.Desc>{props.desc}</S.Desc>}
        </S.Header>
        <S.Content>{props.children}</S.Content>
        <S.Footer>{props.footer}</S.Footer>
      </S.Container>
    </FloatingPanelWidget>
  );
};

const BASE_LABEL = 'oxide-dialog-widget';
namespace S {
  export const Container = themed.div`
    label: ${BASE_LABEL};
    display: flex;
    flex-direction: column;
  `;

  export const Header = themed.div`
    label: ${BASE_LABEL}__header;
    background: ${(p) => p.theme.combobox.headerBackground};
    backdrop-filter: blur(3px);
    padding: 25px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
  `;

  export const Logo = themed.img`
    label: ${BASE_LABEL}_logo;
    width: 200px;
  `;

  export const Content = themed.div`
    label: ${BASE_LABEL}__Content;
    flex-grow: 1;
  `;

  export const Footer = themed.div`
    label: ${BASE_LABEL}_footer;
    background: ${(p) => p.theme.combobox.headerBackground};
    backdrop-filter: blur(3px);
    padding: 8px 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-shrink: 0;
  `;

  export const Title = themed.div`
    label: ${BASE_LABEL}_title;
    font-size: 25px;
    font-weight: 600;
    color: ${(p) => p.theme.combobox.text};
    margin-bottom: 15px;
  `;

  export const Desc = themed.div`
    label: ${BASE_LABEL}__desc;
    font-size: 14px;
    color: ${(p) => p.theme.combobox.text};
    opacity: 0.7;
  `;
}
