import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { styled } from '../../../stores/themes/reactor-theme-fragment';
import { observer } from 'mobx-react';

export interface DatePickerInputWidgetProps {
  date: Date;
  dateChanged: (date: Date) => any;
  className?: string;
}

namespace S {
  export const Container = styled.div<{}>`
    .rdp-root {
      --rdp-accent-color: ${(p) => p.theme.text.primary};
      --rdp-accent-background-color: ${(p) => p.theme.header.primary};
      --rdp-day-height: 30px;
      --rdp-day-width: 30px;
      color: ${(p) => p.theme.text.primary};
    }
  `;
}

export const DatePickerInputWidget: React.FC<DatePickerInputWidgetProps> = observer((props) => {
  return (
    <S.Container className={props.className}>
      <DayPicker
        showOutsideDays={false}
        defaultMonth={props.date}
        selected={props.date}
        mode="single"
        onDayClick={(day) => {
          props.dateChanged(day);
        }}
      />
    </S.Container>
  );
});
