import * as React from 'react';
import styled from '@emotion/styled';
import { inject } from '../../inversify.config';
import { FloatingInspectorSectionWidget } from '../floating/FloatingInspectorSectionWidget';
import { CronEditorSimple } from './CronEditorSimple';
import { CronEditorAdvance } from './CronEditorAdvance';
import { FloatingPanelButtonWidget } from '../floating/FloatingPanelButtonWidget';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface CronEditorWidgetProps {
  className?;
  color?: string;
  value: string[];
  onChange: (value: string) => any;
}

export interface CronEditorWidgetStateSetting {
  advance: boolean;
}

export interface CronEditorWidgetState {
  value: string[];
  settings: Partial<CronEditorWidgetStateSetting>;
}

namespace S {
  export const Container = themed.div`
    padding: 15px;
  `;

  export const Toggle = styled.div<{ enabled: boolean }>`
    display: flex;
    align-items: center;
    padding-bottom: 5px;
    opacity: ${(p) => (p.enabled ? 1 : 0.4)};
    pointer-events: ${(p) => (p.enabled ? 'all' : 'none')};

    &:nth-last-of-type {
      padding-bottom: 0px;
    }
  `;

  export const ToggleLabel = styled.div`
    margin-left: 10px;
    font-size: 14px;
  `;
}

/**
 * Default value used when initializing
 */
export const CRON_DEFAULT = ['0', '0-0', '1/1', '*', '*'];

export class CronEditorWidget extends React.Component<CronEditorWidgetProps, CronEditorWidgetState> {
  @inject(ComboBoxStore)
  accessor comboboxStore: ComboBoxStore;

  constructor(props) {
    super(props);

    // Check if Basic mode inits, otherwise show advance
    const cron = CronEditorSimple.setupCronUI(props.value);

    this.state = {
      value: props.value,
      settings: {
        advance: cron?.unit ? false : true
      }
    };
  }

  update(partial: Partial<CronEditorWidgetStateSetting>) {
    this.setState({
      settings: {
        ...this.state.settings,
        ...partial
      }
    });
  }

  onValueChange(val) {
    if (!val || !val.length) {
      val = CRON_DEFAULT;
    }

    this.setState({ value: val });
    this.parentChange(val);
  }

  parentChange(val) {
    let newVal = '';
    newVal = val.toString().replace(/,/g, ' ');
    newVal = newVal.replace(/!/g, ',');
    this.props.onChange(newVal);
  }

  render() {
    return (
      <>
        <FloatingInspectorSectionWidget inline={true} name="Schedule mode">
          <FloatingPanelButtonWidget
            btn={{
              label: `${this.state.settings.advance ? 'Advanced' : ' Simple'}`,
              action: async (e) => {
                const selection = await this.comboboxStore.showComboBox(
                  ['Simple', 'Advanced'].map((item) => {
                    return {
                      key: item,
                      title: item
                    };
                  }),
                  e
                );
                if (selection?.key) {
                  this.update({
                    advance: selection.key === 'Advanced'
                  });
                }
              }
            }}
          />
        </FloatingInspectorSectionWidget>
        {!this.state.settings.advance && (
          <CronEditorSimple value={this.state.value} onChange={this.onValueChange.bind(this)} />
        )}
        {this.state.settings.advance && (
          <CronEditorAdvance value={this.state.value} onChange={this.onValueChange.bind(this)} />
        )}
      </>
    );
  }
}
