import * as React from 'react';

import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { inject } from '../../inversify.config';
import styled from '@emotion/styled';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { FloatingPanelButtonWidget } from '../floating/FloatingPanelButtonWidget';
import { FloatingInspectorSectionWidget } from '../floating/FloatingInspectorSectionWidget';
import { CRON_DEFAULT } from './CronEditor';
import { CronEditorHelper } from './CronEditorHelper';

export interface CronEditorSimpleWidgetProps {
  className?;
  color?: string;
  value: string[];
  onChange: (value: string[]) => any;
}

export interface CronEditorSimpleWidgetState {
  value: string[];
  cron?: CronEditorSimpleWidgetCronState;
}

export interface CronEditorSimpleWidgetCronState {
  unit?: CronEditorSimpleWidgetCronUnit;
  minute?: string;
  hour?: string;
  day?: string;
  week?: string;
  weekday?: string;
  month?: string;
}

export enum CronEditorSimpleWidgetCronUnit {
  MINUTE = 'Minute',
  HOUR = 'Hour',
  DAY = 'Day',
  WEEKDAY = 'Weekday',
  WEEK = 'Week',
  MONTH = 'Month'
}

enum CronEditorSimpleWidgetCronDayOfWeek {
  MON = 'Monday',
  TUE = 'Tuesday',
  WED = 'Wednesday',
  THU = 'Thursday',
  FRI = 'Friday',
  SAT = 'Saturday',
  SUN = 'Sunday'
}

namespace S {
  export const Container = themed.div`
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    padding-bottom: 4px;

    &:last-of-type {
      padding-bottom: 0;
    }
  `;

  export const Name = themed.div`
    font-size: 14px;
    flex-grow: 2;
    padding-top: 4px;
    color: ${(p) => p.theme.combobox.text};
  `;

  export const Content = styled.div`
    margin-left: 0px;
    flex-grow: 1;
  `;
}

export class CronEditorSimple extends React.Component<CronEditorSimpleWidgetProps, CronEditorSimpleWidgetState> {
  @inject(ComboBoxStore)
  accessor comboboxStore: ComboBoxStore;

  constructor(props) {
    super(props);

    let cron = CronEditorSimple.setupCronUI(props.value);
    this.state = {
      value: props.value,
      cron: cron
    };
  }

  /**
   * Setup the Basic Cron UI
   * Detects based on the cron if this is a simple Editor otherwise advance
   */
  static setupCronUI(value: string[]): CronEditorSimpleWidgetCronState {
    let cron: CronEditorSimpleWidgetCronState = {};

    if (CronEditorHelper.test.MONTH(value)) {
      cron.unit = CronEditorSimpleWidgetCronUnit.MONTH;
      cron.hour = CronEditorHelper.getHour(value);
      cron.month = value[2];
    } else if (CronEditorHelper.test.WEEK(value)) {
      cron.unit = CronEditorSimpleWidgetCronUnit.WEEK;
      cron.hour = CronEditorHelper.getHour(value);
      cron.weekday = value[4];
    } else if (CronEditorHelper.test.WEEKDAY(value)) {
      cron.unit = CronEditorSimpleWidgetCronUnit.WEEKDAY;
      cron.hour = CronEditorHelper.getHour(value);
    } else if (CronEditorHelper.test.DAY(value)) {
      cron.unit = CronEditorSimpleWidgetCronUnit.DAY;
      cron.hour = CronEditorHelper.getHour(value);
    } else if (CronEditorHelper.test.HOUR(value)) {
      cron.unit = CronEditorSimpleWidgetCronUnit.HOUR;
    } else if (CronEditorHelper.test.MINUTE(value)) {
      cron.unit = CronEditorSimpleWidgetCronUnit.MINUTE;
    }

    return cron;
  }

  updateCronUnit(unit: CronEditorSimpleWidgetCronUnit) {
    let value = this.state.value || [...CRON_DEFAULT];

    // Remember the time choice if one was made
    let currentTime = value[1].includes('-') ? value[1] : '1-1';

    if (unit === CronEditorSimpleWidgetCronUnit.MINUTE) {
      value = ['*', '*', '*', '*', '*']; // Every Minute
    } else if (unit === CronEditorSimpleWidgetCronUnit.HOUR) {
      value = [this.randomMinute, '1/1', '*', '*', '*']; // Every Hour
    } else if (unit === CronEditorSimpleWidgetCronUnit.DAY) {
      value = [this.randomMinute, currentTime, '1/1', '*', '*'];
    } else if (unit === CronEditorSimpleWidgetCronUnit.WEEK) {
      value = [this.randomMinute, currentTime, '1/1', '*', 'MON'];
    } else if (unit === CronEditorSimpleWidgetCronUnit.WEEKDAY) {
      value = [this.randomMinute, currentTime, '1/1', '*', 'MON-FRI'];
    } else if (unit === CronEditorSimpleWidgetCronUnit.MONTH) {
      value = [this.randomMinute, currentTime, '1', '*', '*'];
    }

    // Setup cron state
    const cron = CronEditorSimple.setupCronUI(value);

    this.props.onChange(value);
    this.setState({
      value: value,
      cron: {
        ...cron,
        unit: unit
      }
    });
  }

  updateCronState(partial: Partial<CronEditorSimpleWidgetCronState>) {
    let value = this.state.value;
    let cron = {
      ...this.state.cron,
      ...partial
    };

    // Check if a minute value exists or generate one
    if (value[0].includes('*') || value[0] === '0') {
      value[0] = this.randomMinute;
    }

    if (this.state.cron?.unit === CronEditorSimpleWidgetCronUnit.DAY) {
      value[1] = cron.hour ? `${cron.hour}-${cron.hour}` : value[1];
      value[2] = '1/1';
    } else if (this.state.cron?.unit === CronEditorSimpleWidgetCronUnit.WEEKDAY) {
      value[1] = cron.hour ? `${cron.hour}-${cron.hour}` : value[1];
      value[2] = '1/1';
      value[4] = 'MON-FRI';
    } else if (this.state.cron?.unit === CronEditorSimpleWidgetCronUnit.WEEK) {
      value[1] = cron.hour ? `${cron.hour}-${cron.hour}` : value[1];
      value[2] = '1/1';
      value[4] = cron.weekday ? `${cron.weekday}` : '*';
    } else if (this.state.cron?.unit === CronEditorSimpleWidgetCronUnit.MONTH) {
      value[1] = cron.hour ? `${cron.hour}-${cron.hour}` : value[1];
      value[2] = cron.month ? `${cron.month}` : '1';
    }

    this.props.onChange(value);
    this.setState({
      value: value,
      cron: cron
    });
  }

  /**
   * Generate value between 1 and 59
   */
  get randomMinute() {
    return (Math.random() * 58 + 1).toFixed(0);
  }

  /**
   * Render a generic selection button
   * @param key
   * @param items
   */
  renderSelection(key, title, label, items) {
    return (
      <S.Container>
        <S.Name>{title}</S.Name>
        <S.Content>
          <FloatingPanelButtonWidget
            btn={{
              label: label || 'Select',
              action: async (e) => {
                const selection = await this.comboboxStore.showComboBox(
                  items.map((item) => {
                    return {
                      key: item.key,
                      title: item.title
                    };
                  }),
                  e
                );
                if (selection) {
                  this.updateCronState({
                    [key]: selection.key
                  });
                }
              }
            }}
          />
        </S.Content>
      </S.Container>
    );
  }

  renderTimeSelection() {
    let times = [];
    for (let i = 0; i < 24; i++) {
      let label = `${i < 10 ? '0' + i : i}:00 - ${i < 10 ? '0' + i : i}:59`;
      times.push({
        key: `${i}`,
        title: label
      });
    }

    let label = times.find((item) => item.key === this.state.cron?.hour);

    if (
      this.state.cron?.unit === CronEditorSimpleWidgetCronUnit.DAY ||
      this.state.cron?.unit === CronEditorSimpleWidgetCronUnit.WEEK ||
      this.state.cron?.unit === CronEditorSimpleWidgetCronUnit.WEEKDAY ||
      this.state.cron?.unit === CronEditorSimpleWidgetCronUnit.MONTH
    ) {
      return this.renderSelection('hour', 'Run this task between', label?.title, times);
    }
  }

  renderDayOfWeekSelection() {
    let days_of_week = Object.keys(CronEditorSimpleWidgetCronDayOfWeek).map((key) => {
      return {
        key: key,
        title: CronEditorSimpleWidgetCronDayOfWeek[key]
      };
    });

    let label = days_of_week.find((item) => item.key === this.state.cron?.weekday);

    if (this.state.cron?.unit === CronEditorSimpleWidgetCronUnit.WEEK) {
      return this.renderSelection('weekday', 'Run this task on', label?.title, days_of_week);
    }
  }

  renderDayOfMonthSelection() {
    let days = [];
    for (let i = 1; i < 31; i++) {
      days.push({
        key: `${i}`,
        title: ordinal_suffix_of(i)
      });
    }

    let label = days.find((item) => item.key === this.state.cron?.month);

    if (this.state.cron?.unit === CronEditorSimpleWidgetCronUnit.MONTH) {
      return this.renderSelection('month', 'Run this task on', label?.title, days);
    }

    /**
     * Generate the Ordinal Suffix
     * @param i
     */
    function ordinal_suffix_of(i) {
      let j = i % 10;
      let k = i % 100;
      if (j == 1 && k != 11) {
        return i + 'st';
      }
      if (j == 2 && k != 12) {
        return i + 'nd';
      }
      if (j == 3 && k != 13) {
        return i + 'rd';
      }
      return i + 'th';
    }
  }

  render() {
    return (
      <>
        <FloatingInspectorSectionWidget name="Schedule">
          <S.Container>
            <S.Name>Run this task every</S.Name>
            <S.Content>
              <FloatingPanelButtonWidget
                btn={{
                  label: `${this.state.cron?.unit ? this.state.cron.unit : 'Select'}`,
                  action: async (e) => {
                    const unit = await this.comboboxStore.showComboBox(
                      Object.keys(CronEditorSimpleWidgetCronUnit).map((key) => {
                        return {
                          key: key,
                          title: CronEditorSimpleWidgetCronUnit[key]
                        };
                      }),
                      e
                    );
                    if (unit) {
                      this.updateCronUnit(CronEditorSimpleWidgetCronUnit[unit.key]);
                    }
                  }
                }}
              />
            </S.Content>
          </S.Container>

          {this.renderDayOfMonthSelection()}
          {this.renderDayOfWeekSelection()}
          {this.renderTimeSelection()}
        </FloatingInspectorSectionWidget>
      </>
    );
  }
}
