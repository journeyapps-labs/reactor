import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { IconWidget, ReactorIcon } from '../icons/IconWidget';
import styled from '@emotion/styled';
import { ComboBoxStore2 } from '../../stores/combo2/ComboBoxStore2';
import { inject } from '../../inversify.config';
import { SimpleComboBoxDirective } from '../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { SearchStore } from '../../stores/SearchStore';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';
import { Size, useReactorSize } from '../../hooks/useReactorSize';

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
  size?: Size;
}

export enum SearchWidgetDesign {
  PANEL = 'panel',
  FORM = 'form'
}

export const SEARCH_ICON_WIDTH = 30;

namespace S {
  export const IconRight = themed.div<{ $size: Size }>`
    color: ${(p) => p.theme.panels.searchForeground};
    opacity: 0.58;
    padding: ${(p) => (p.$size === Size.SMALL ? '5px' : p.$size === Size.LARGE ? '9px' : '7px')};
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

  export const Container = themed.div<{ rounded: boolean; design: SearchWidgetDesign; $size: Size }>`
    position: relative;
    background: ${(p) =>
      p.design === SearchWidgetDesign.FORM ? p.theme.forms.inputBackground : p.theme.panels.searchBackground};
    border-radius: ${(p) => (p.$size === Size.SMALL ? '3px' : p.$size === Size.LARGE ? '7px' : '5px')};
    border: solid 1px ${(p) =>
      getTransparentColor(
        p.design === SearchWidgetDesign.FORM ? p.theme.forms.inputForeground : p.theme.panels.searchForeground,
        0.1
      )};
    ${(p) => p.rounded && `border-radius: ${p.$size === Size.LARGE ? 12 : p.$size === Size.MEDIUM ? 10 : 8}px;`}
  `;

  export const Input = themed.input<{ design: SearchWidgetDesign; $size: Size }>`
    width: 100%;
    padding-left: ${(p) => (p.$size === Size.SMALL ? SEARCH_ICON_WIDTH : p.$size === Size.LARGE ? 42 : 36)}px;
    background: transparent;
    border: none;
    outline: none;
    font-size: ${(p) => (p.$size === Size.SMALL ? '13px' : p.$size === Size.LARGE ? '17px' : '15px')};
    vertical-align: middle;
    line-height: ${(p) => (p.$size === Size.SMALL ? '23px' : p.$size === Size.LARGE ? '31px' : '27px')};
    color: ${(p) =>
      p.design === SearchWidgetDesign.FORM ? p.theme.forms.inputForeground : p.theme.panels.searchForeground};

    ::placeholder {
      color: ${(p) =>
        p.design === SearchWidgetDesign.FORM ? p.theme.forms.inputForeground : p.theme.panels.searchForeground};
      opacity: 0.5;
    }
  `;

  export const Icon = themed.div<{ $size: Size }>`
    position: absolute;
    pointer-events: none;
    left: ${(p) => (p.$size === Size.SMALL ? '6px' : p.$size === Size.LARGE ? '10px' : '8px')};
    top: 50%;
    transform: translateY(-50%);
    color: ${(p) => p.theme.panels.searchForeground};
    opacity: 0.5;
    font-size: ${(p) => (p.$size === Size.SMALL ? '13px' : p.$size === Size.LARGE ? '17px' : '15px')};
  `;
}

class SearchWidgetInternal extends React.Component<SearchWidgetProps & { resolvedSize: Size }> {
  ref: React.RefObject<HTMLInputElement>;

  @inject(ComboBoxStore2)
  accessor comboBoxStore2: ComboBoxStore2;

  @inject(SearchStore)
  accessor searchStore: SearchStore;

  constructor(props: SearchWidgetProps & { resolvedSize: Size }) {
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
        <S.Icon $size={this.props.resolvedSize}>
          <IconWidget icon="sync-alt" spin={true} />
        </S.Icon>
      );
    }
    return (
      <S.Icon $size={this.props.resolvedSize}>
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
        $size={this.props.resolvedSize}
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
        $size={this.props.resolvedSize}
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
      <S.Container
        design={this.getDesign()}
        rounded={this.props.rounded}
        $size={this.props.resolvedSize}
        className={this.props.className}
      >
        {this.getSearchIcon()}
        <S.Input
          design={this.getDesign()}
          $size={this.props.resolvedSize}
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

export const SearchWidget: React.FC<SearchWidgetProps> = (props) => {
  const size = useReactorSize(props.size);
  return <SearchWidgetInternal {...props} resolvedSize={size} />;
};
