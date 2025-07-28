import * as React from 'react';
import { useState } from 'react';
import { MousePosition, SmartPositionWidget } from '../../../layers/combo/SmartPositionWidget';
import { DateTimePickerWidget, DateTimePickerWidgetProps } from './DateTimePickerWidget';
import { FloatingPanelWidget } from '../../floating/FloatingPanelWidget';
import { FloatingPanelButtonWidget } from '../../floating/FloatingPanelButtonWidget';
import { styled } from '../../../stores/themes/reactor-theme-fragment';

export interface DateTimePickerLayerWidgetProps extends DateTimePickerWidgetProps {
  position: MousePosition;
  label: string;
  close: () => any;
}

export const DateTimePickerLayerWidget: React.FC<DateTimePickerLayerWidgetProps> = (props) => {
  const [date, setDate] = useState(props.date);
  return (
    <SmartPositionWidget position={props.position}>
      <S.FloatingPanel center={false}>
        <S.FloatingLabel>{props.label}</S.FloatingLabel>
        <DateTimePickerWidget
          type={props.type}
          date={date}
          dateChanged={(d) => {
            setDate(d);
          }}
        />
        <S.FloatingButtons>
          <S.FloatingButton
            btn={{
              label: 'Cancel',
              action: () => {
                props.close?.();
              }
            }}
          />
          <S.FloatingButton
            btn={{
              label: 'Apply',
              submitButton: true,
              action: () => {
                props.dateChanged(date);
              }
            }}
          />
        </S.FloatingButtons>
      </S.FloatingPanel>
    </SmartPositionWidget>
  );
};

namespace S {
  export const FloatingLabel = styled.div`
    font-size: 16px;
    padding-bottom: 10px;
    color: ${(p) => p.theme.text.primary};
  `;

  export const FloatingPanel = styled(FloatingPanelWidget)`
    padding: 10px;
  `;

  export const FloatingButton = styled(FloatingPanelButtonWidget)`
    margin: 5px;
  `;

  export const FloatingButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `;
}
