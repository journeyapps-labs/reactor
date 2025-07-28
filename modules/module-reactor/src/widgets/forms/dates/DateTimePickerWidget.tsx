import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { InputContainerWidget } from '../InputContainerWidget';
import { Input } from '../inputs';
import { DateTime } from 'luxon';
import { DatePickerInputWidget } from './DatePickerInputWidget';

export enum DateTimePickerType {
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime'
}

export interface DateTimePickerWidgetProps {
  date: Date;
  dateChanged: (date: Date) => any;
  validityChanged?: (valid: boolean) => any;
  className?: any;
  type?: DateTimePickerType;
}

export const DateTimePickerWidget: React.FC<DateTimePickerWidgetProps> = (props) => {
  const dt = DateTime.fromJSDate(props.date);
  const type = props.type || DateTimePickerType.DATETIME;
  const [time, setTime] = useState<{ time: string; ob: DateTime }>({
    ob: dt,
    time: dt.toLocaleString(DateTime.TIME_24_SIMPLE)
  });
  const [date, setDate] = useState(props.date);
  const [valid, setValid] = useState<boolean>(true);

  useEffect(() => {
    const t2 = dt.toLocaleString(DateTime.TIME_24_SIMPLE);
    if (t2 !== time.time) {
      setTime({
        ob: DateTime.fromJSDate(props.date),
        time: t2
      });
    }
    setDate(props.date);
  }, [props.date.toISOString()]);

  useEffect(() => {
    if (!time.ob.isValid) {
      setValid(false);
      return;
    }
    setValid(true);

    const newDate = DateTime.fromObject(
      {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: time.ob.hour,
        minute: time.ob.minute,
        second: props.date.getSeconds()
      },
      {
        zone: time.ob.zone
      }
    ).toJSDate();

    if (newDate.toUTCString() !== props.date.toUTCString()) {
      props.dateChanged(newDate);
    }
  }, [time.time, date.toDateString()]);

  useEffect(() => {
    props.validityChanged?.(valid);
  }, [valid]);

  if (type === DateTimePickerType.DATETIME) {
    return (
      <S.Container className={props.className}>
        <InputContainerWidget error={!valid ? 'Invalid time' : ''} label="Time">
          <S.TimeInput
            value={time.time}
            onChange={(event) => {
              setTime({
                time: event.target.value,
                ob: DateTime.fromFormat(event.target.value.trim(), 'hh:mm')
              });
            }}
          />
        </InputContainerWidget>
        <InputContainerWidget label="Date">
          <DatePickerInputWidget
            date={date}
            dateChanged={(date) => {
              setDate(date);
            }}
          />
        </InputContainerWidget>
      </S.Container>
    );
  }
  if (type === DateTimePickerType.TIME) {
    return (
      <S.TimeInput
        className={props.className}
        value={time.time}
        onChange={(event) => {
          setTime({
            time: event.target.value,
            ob: DateTime.fromFormat(event.target.value.trim(), 'hh:mm')
          });
        }}
      />
    );
  }

  if (type === DateTimePickerType.DATE) {
    return (
      <DatePickerInputWidget
        className={props.className}
        date={date}
        dateChanged={(date) => {
          setDate(date);
        }}
      />
    );
  }
};
namespace S {
  export const Container = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 5px;
  `;

  export const TimeInput = styled(Input)`
    font-size: 20px;
  `;
}
