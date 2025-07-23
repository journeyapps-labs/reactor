import * as React from 'react';
import { inject } from '../../inversify.config';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '../../stores/themes/reactor-theme-fragment';

export interface RegexSearchPayload {
  regex: string;
  options: RegexOptions[];
}

export interface RegexSearchWidgetProps {
  initialValue?: RegexSearchPayload;
  changed: (search: RegexSearchPayload) => any;
}

export type RegexSearchWidgetState = RegexSearchPayload;

export enum RegexOptions {
  GLOBAL = 'g',
  CASE_INSENSITIVE = 'i'
}

const spacing = 5;

namespace S {
  export const Container = styled.div<{ valid: boolean }>`
    display: flex;
    color: ${(p) => p.theme.text.primary};
    background: ${(p) => (p.valid ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0,0, 0.1)')};
    align-items: center;
    padding-left: 5px;
    padding-right: 5px;
  `;

  export const Input = styled.input`
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 12px;
    vertical-align: middle;
    line-height: 25px;
    color: ${(p) => p.theme.text.primary};
    padding-left: ${spacing}px;
    padding-right: ${spacing}px;
  `;

  export const Slash = styled.div`
    opacity: 0.5;
    font-size: 14px;
    font-weight: bold;
    user-select: none;
  `;

  export const Options = styled.div`
    opacity: 0.5;
    cursor: pointer;
    padding-left: ${spacing}px;

    &:hover {
      opacity: 1;
    }
    user-select: none;
  `;

  export const NoOptions = styled.div`
    white-space: nowrap;
    font-size: 12px;
    opacity: 0.5;
    user-select: none;
  `;

  export const Icon = styled.div`
    cursor: pointer;
    padding-left: ${spacing}px;
    opacity: 0.3;
    user-select: none;
    &:hover {
      opacity: 1;
    }
  `;
}

export class RegexSearchWidget extends React.Component<RegexSearchWidgetProps, RegexSearchWidgetState> {
  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  constructor(props: RegexSearchWidgetProps) {
    super(props);
    this.state = {
      regex: props.initialValue?.regex || '',
      options: props.initialValue?.options || [RegexOptions.GLOBAL]
    };
  }

  getOptions() {
    if (!this.state.options || this.state.options.length === 0) {
      return <S.NoOptions>(no options)</S.NoOptions>;
    }
    return this.state.options.join('');
  }

  isValid(): boolean {
    try {
      new RegExp(`/${this.state.regex}/${this.getOptions()}`);
    } catch (e) {
      return false;
    }
    return true;
  }

  fireChange() {
    if (this.isValid()) {
      this.props.changed?.(this.state);
    }
  }

  render() {
    return (
      <S.Container valid={this.isValid()}>
        <S.Slash>/</S.Slash>
        <S.Input
          placeholder="type regex here"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              this.fireChange();
            }
          }}
          onChange={(event) => {
            this.setState({
              regex: event.target.value
            });
          }}
        />
        <S.Slash>/</S.Slash>
        <S.Options
          onClick={async (event) => {
            event.persist();
            const options = await this.comboBoxStore.showMultiSelectComboBox(
              [
                {
                  key: RegexOptions.GLOBAL,
                  title: 'Global',
                  checked: this.state.options.indexOf(RegexOptions.GLOBAL) !== -1
                },
                {
                  key: RegexOptions.CASE_INSENSITIVE,
                  title: 'Case insensitive',
                  checked: this.state.options.indexOf(RegexOptions.CASE_INSENSITIVE) !== -1
                }
              ],
              event
            );
            if (options) {
              this.setState({
                options: options.map((o) => o.key) as RegexOptions[]
              });
            }
          }}
        >
          {this.getOptions()}
        </S.Options>
        <S.Icon
          onClick={() => {
            this.fireChange();
          }}
        >
          <FontAwesomeIcon icon="arrow-circle-right" />
        </S.Icon>
      </S.Container>
    );
  }
}
