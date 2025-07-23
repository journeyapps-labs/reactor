import * as React from 'react';
import { DateTime } from 'luxon';
import { styled } from '../../../stores/themes/reactor-theme-fragment';
import { PanelButtonWidget } from '../PanelButtonWidget';
import { DateTimePickerType, DateTimePickerWidgetProps } from './DateTimePickerWidget';
import { DateTimePickerLayerWidget } from './DateTimePickerLayerWidget';
import { ioc } from '../../../inversify.config';
import { Layer, LayerManager } from '../../../stores/layer/LayerManager';

export interface DateTimeButtonWidgetProps extends DateTimePickerWidgetProps {
  label?: string;
}

namespace S {
  export const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `;

  export const Label = styled.div`
    margin-right: 5px;
    font-size: 14px;
    color: ${(p) => p.theme.text.secondary};
  `;
}

export const DateTimeButtonWidget: React.FC<DateTimeButtonWidgetProps> = (props) => {
  const dt = DateTime.fromJSDate(props.date);

  let label = dt.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
  if (props.type === DateTimePickerType.DATE) {
    label = dt.toLocaleString(DateTime.DATETIME_SHORT);
  } else if (props.type === DateTimePickerType.TIME) {
    label = dt.toLocaleString(DateTime.TIME_WITH_SECONDS);
  }

  return (
    <>
      <S.Wrapper className={props.className}>
        <S.Label>{props.label}</S.Label>
        <PanelButtonWidget
          label={label}
          action={(event2) => {
            ioc.get(LayerManager).registerLayer(
              new Layer({
                render: (event) => {
                  return (
                    <DateTimePickerLayerWidget
                      {...props}
                      label="Select a date"
                      close={() => {
                        event.layer.dispose();
                      }}
                      dateChanged={(date) => {
                        event.layer.dispose();
                        props.dateChanged(date);
                      }}
                      position={event2}
                    />
                  );
                }
              })
            );
          }}
        />
      </S.Wrapper>
    </>
  );
};
