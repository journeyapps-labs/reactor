import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { IconWidget, ReactorIcon } from '../icons/IconWidget';
import styled from '@emotion/styled';
import { ComboBoxStore2 } from '../../stores/combo2/ComboBoxStore2';
import { inject } from '../../inversify.config';
import { SimpleComboBoxDirective } from '../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { SearchStore } from '../../stores/SearchStore';
import { ComboBoxItem } from '../../stores';
import { getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';

export interface SearchWidgetProps {
  searchChanged: (search: string) => any;
  search: string;
  focusOnMount?: boolean;
  placeholder?: string;
  rounded?: boolean;
  className?;
  loading?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  design?: SearchWidgetDesign;
  icon?: ReactorIcon;
  historyContext?: string;
}

export enum SearchWidgetDesign {
  PANEL = 'panel',
  FORM = 'form'
}

export const SEARCH_ICON_WIDTH = 30;

namespace S {
  export const IconRight = themed.div`
    color: ${(p) => p.theme.panels.searchForeground};
    opacity: 0.58;
    padding: 5px;
    cursor: pointer;

    &:hover{
      opacity: 0.9;
    }
  `;

  export const RightIcons = styled.div`
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
  `;

  export const Container = themed.div<{ rounded: boolean; design: SearchWidgetDesign }>`
    position: relative;
    background: ${(p) =>
      p.design === SearchWidgetDesign.FORM ? p.theme.forms.inputBackground : p.theme.panels.searchBackground};
    border-radius: 3px;
    border: solid 1px ${(p) =>
      getTransparentColor(
        p.design === SearchWidgetDesign.FORM ? p.theme.forms.inputForeground : p.theme.panels.searchForeground,
        0.1
      )};
    ${(p) => p.rounded && `border-radius: 8px;`}
  `;

  export const Input = themed.input<{ design: SearchWidgetDesign }>`
    width: 100%;
    padding-left: ${SEARCH_ICON_WIDTH}px;
    background: transparent;
    border: none;
    outline: none;
    font-size: 13px;
    vertical-align: middle;
    line-height: 23px;
    color: ${(p) =>
      p.design === SearchWidgetDesign.FORM ? p.theme.forms.inputForeground : p.theme.panels.searchForeground};

    ::placeholder {
      color: ${(p) =>
        p.design === SearchWidgetDesign.FORM ? p.theme.forms.inputForeground : p.theme.panels.searchForeground};
      opacity: 0.5;
    }
  `;

  export const Icon = themed.div`
    position: absolute;
    pointer-events: none;
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
    color: ${(p) => p.theme.panels.searchForeground};
    opacity: 0.5;
    font-size: 13px;
  `;
}

export class SearchWidget extends React.Component<SearchWidgetProps> {
  ref: React.RefObject<HTMLInputElement>;

  @inject(ComboBoxStore2)
  accessor comboBoxStore2: ComboBoxStore2;

  @inject(SearchStore)
  accessor searchStore: SearchStore;

  constructor(props: SearchWidgetProps) {
    super(props);
    this.ref = React.createRef();
  }

  getDesign(): SearchWidgetDesign {
    return this.props.design || SearchWidgetDesign.PANEL;
  }

  componentDidMount(): void {
    if (this.props.focusOnMount) {
      this.getRef().current?.focus();
    }
  }

  componentWillUnmount() {
    this.store();
  }

  fireChange(value) {
    this.setState(
      {
        value: value
      },
      () => {
        this.props.searchChanged && this.props.searchChanged(value);
      }
    );
  }

  getSearchIcon() {
    if (this.props.loading) {
      return (
        <S.Icon>
          <IconWidget icon="sync-alt" spin={true} />
        </S.Icon>
      );
    }
    return (
      <S.Icon>
        <IconWidget icon={(this.props.icon as any) || 'search'} />
      </S.Icon>
    );
  }

  store() {
    if (this.props.historyContext) {
      this.searchStore.getHistoryContext(this.props.historyContext).push(this.props.search);
    }
  }

  getCancel() {
    if (!this.props.search) {
      return null;
    }
    return (
      <S.IconRight
        onClick={() => {
          this.store();
          this.fireChange(null);
          // the default value hack we have in place, means that the below line becomes necessary
          this.getRef().current.value = '';
        }}
      >
        <FontAwesomeIcon icon="times" />
      </S.IconRight>
    );
  }

  getHistory() {
    if (!this.props.historyContext) {
      return null;
    }
    return (
      <S.IconRight
        onClick={(event) => {
          const context = this.searchStore.getHistoryContext(this.props.historyContext);

          this.comboBoxStore2.show(
            new SimpleComboBoxDirective({
              title: 'Search history',
              items: context.getTerms(5).map((t) => {
                return {
                  key: t,
                  title: t,
                  action: async () => {
                    this.fireChange(t);
                    this.getRef().current.value = t;
                  }
                } as ComboBoxItem;
              }),
              event: event
            })
          );
        }}
      >
        <FontAwesomeIcon icon="bars-staggered" />
      </S.IconRight>
    );
  }

  getRef = (): React.RefObject<HTMLInputElement> => {
    if (this.props.inputRef) {
      return this.props.inputRef;
    }
    return this.ref;
  };

  render() {
    return (
      <S.Container design={this.getDesign()} rounded={this.props.rounded} className={this.props.className}>
        {this.getSearchIcon()}
        <S.Input
          design={this.getDesign()}
          ref={this.getRef()}
          defaultValue={this.props.search || ''}
          placeholder={this.props.placeholder === '' ? '' : 'Search'}
          onChange={(event) => {
            let val = event.target.value;
            if (!val || val.trim() === '') {
              val = null;
              this.store();
            }

            this.fireChange(val);
          }}
        />
        <S.RightIcons>
          {this.getCancel()}
          {this.getHistory()}
        </S.RightIcons>
      </S.Container>
    );
  }
}
