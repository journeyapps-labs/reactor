import * as React from 'react';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { inject } from '../../inversify.config';
import { Input } from '../forms/inputs';
import { PillWidget } from '../status/PillWidget';
import cronstrue from 'cronstrue';
import { FloatingInspectorSectionWidget } from '../floating/FloatingInspectorSectionWidget';
import { theme, themed } from '../../stores/themes/reactor-theme-fragment';
import { ThemeStore } from '../../stores/themes/ThemeStore';

enum SectionType {
  MINUTE = 'Minute',
  HOUR = 'Hour',
  DAY = 'Day',
  MONTH = 'Month',
  DAY_OF_WEEK = 'Day Of Week'
}

export interface CronEditorAdvanceWidgetProps {
  className?;
  color?: string;
  value: string[];
  onChange: (value: string[]) => any;
}

export interface CronEditorAdvanceWidgetState {
  value: string[];
  selection?: SectionType;
}

namespace S {
  export const Container = themed.div`
    padding: 15px;
  `;

  export const CronSectionLabel = themed.div`
    margin: 10px 0px;
    justify-content: space-between;
    display: flex;
  `;

  export const CronTooltip = themed.div`
    color: ${(p) => p.theme.text.primary};
    background: ${(p) => p.theme.panels.trayBackground};
    outline: none;
    border: none;
    padding: 10px 10px;
    margin-top: 10px;
    min-height: 166px;
  `;

  export const CronTooltipTD = themed.td`
    padding-right: 30px
  `;

  export const TaskDescription = themed.div`
    max-width: 300px;
    color: ${(p) => p.theme.text.primary};
  `;
}

export class CronEditorAdvance extends React.Component<CronEditorAdvanceWidgetProps, CronEditorAdvanceWidgetState> {
  @inject(ComboBoxStore)
  accessor comboboxStore: ComboBoxStore;

  @inject(ThemeStore)
  accessor themeStore: ThemeStore;

  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  async onValueChange(e) {
    let val = e && e.target?.value ? e.target.value.split(' ') : null;

    this.setState({ value: val });
    this.props.onChange(val);
  }

  detectSection(e) {
    let value = this.state.value?.join(' ');
    let preValue = value.slice(0, e.target.selectionStart);
    let index = preValue.split(' ').length - 1;
    let section = SectionType[Object.keys(SectionType)[index]];

    this.setState({ selection: section });
  }

  renderPills() {
    const currentTheme = this.themeStore.getCurrentTheme(theme);
    return Object.keys(SectionType).map((key) => {
      return (
        <PillWidget
          key={key}
          label={SectionType[key]}
          color={this.state.selection === SectionType[key] ? currentTheme.status.success : currentTheme.status.loading}
        />
      );
    });
  }

  get displayValueToText() {
    try {
      const val = cronstrue.toString(this.props.value?.join(' '));
      if (val.search('undefined') === -1) {
        return val;
      }
    } catch (error) {
      // Ignore error, user input can generate some errors
      console.warn(error);
    }
    return '';
  }

  render() {
    return (
      <>
        <S.Container>
          <Input
            value={this.state.value?.join(' ')}
            onChange={this.onValueChange.bind(this)}
            onKeyUp={this.detectSection.bind(this)}
            onClick={this.detectSection.bind(this)}
          />

          <S.CronSectionLabel>{this.renderPills()}</S.CronSectionLabel>

          <S.CronTooltip>
            <table>
              <tbody>
                <tr>
                  <S.CronTooltipTD>*</S.CronTooltipTD>
                  <td>any value</td>
                </tr>
                <tr>
                  <S.CronTooltipTD>,</S.CronTooltipTD>
                  <td>value list separator</td>
                </tr>
                <tr>
                  <S.CronTooltipTD>-</S.CronTooltipTD>
                  <td>range of values</td>
                </tr>
                <tr>
                  <S.CronTooltipTD>/</S.CronTooltipTD>
                  <td>step values</td>
                </tr>

                {this.state.selection === SectionType.MINUTE && (
                  <tr>
                    <S.CronTooltipTD>0-59</S.CronTooltipTD>
                    <td>allowed-values</td>
                  </tr>
                )}

                {this.state.selection === SectionType.HOUR && (
                  <tr>
                    <S.CronTooltipTD>0-23</S.CronTooltipTD>
                    <td>allowed-values</td>
                  </tr>
                )}

                {this.state.selection === SectionType.DAY && (
                  <tr>
                    <S.CronTooltipTD>1-31</S.CronTooltipTD>
                    <td>allowed-values</td>
                  </tr>
                )}

                {this.state.selection === SectionType.MONTH && (
                  <tr>
                    <S.CronTooltipTD>1-12</S.CronTooltipTD>
                    <td>allowed-values</td>
                  </tr>
                )}

                {this.state.selection === SectionType.DAY_OF_WEEK && (
                  <>
                    <tr>
                      <S.CronTooltipTD>0-6</S.CronTooltipTD>
                      <td>allowed-values</td>
                    </tr>
                    <tr>
                      <S.CronTooltipTD>SUN-SAT</S.CronTooltipTD>
                      <td>alternative single values</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </S.CronTooltip>
        </S.Container>
        <FloatingInspectorSectionWidget name="Task Execution">
          <S.TaskDescription>{this.displayValueToText}</S.TaskDescription>
        </FloatingInspectorSectionWidget>
      </>
    );
  }
}
