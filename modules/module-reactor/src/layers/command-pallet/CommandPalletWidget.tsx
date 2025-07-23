import * as React from 'react';
import styled from '@emotion/styled';
import { ControlledSearchWidget } from '../../widgets/search/ControlledSearchWidget';
import { TabSelectionKeyboardWidget } from '../../widgets/tabs/TabSelectionKeyboardWidget';
import { TabKeyboardHelpWidget } from '../../widgets/tabs/TabKeyboardHelpWidget';
import { FloatingPanelWidget } from '../../widgets/floating/FloatingPanelWidget';
import { TabDirective } from '../../widgets/tabs/GenericTabSelectionWidget';
import { LargerCMDPalletSetting } from '../../preferences/LargerCMDPalletSetting';
import { observer } from 'mobx-react';
import * as _ from 'lodash';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface CommandPalletWidgetProps {
  searchChanged: (search: string, tab: string) => any;
  tabSelected: string;
  tabs: TabDirective[];
  wheelScroll: () => any;
}

export interface CommandPalletWidgetState {
  selected: string;
  search: string;
}

namespace S {
  export const Container = themed.div<{ larger: boolean }>`
    width: ${(p) => (p.larger ? 950 : 700)}px;
  `;
  export const Content = styled.div<{ larger: boolean }>`
    height: ${(p) => (p.larger ? 450 : 300)}px;
    padding-top: 10px;
    padding-bottom: 10px;
    box-sizing: border-box;
    overflow-y: auto;
  `;
  export const Search = styled.div`
    padding-top: 5px;
    padding-bottom: 5px;
  `;
  export const Top = styled.div`
    display: flex;
    align-items: center;
  `;

  export const Tabs = styled(TabSelectionKeyboardWidget)`
    flex-grow: 1;
  `;
}

@observer
export class CommandPalletWidget extends React.Component<
  React.PropsWithChildren<CommandPalletWidgetProps>,
  CommandPalletWidgetState
> {
  searchInputRef: React.RefObject<HTMLInputElement>;
  constructor(props: CommandPalletWidgetProps) {
    super(props);
    this.state = {
      selected: props.tabSelected,
      search: ''
    };
    this.searchInputRef = React.createRef();
  }

  componentDidUpdate(
    prevProps: Readonly<CommandPalletWidgetProps>,
    prevState: Readonly<CommandPalletWidgetState>,
    snapshot?: any
  ) {
    if (prevState.selected !== this.state.selected) {
      this.searchInputRef.current?.focus();
    }
  }

  render() {
    const larger = LargerCMDPalletSetting.get().checked;
    return (
      <FloatingPanelWidget center={true}>
        <S.Container larger={larger}>
          <S.Top>
            <S.Tabs
              tabSelected={(key: string) => {
                this.setState(
                  {
                    selected: key
                  },
                  () => {
                    _.defer(() => {
                      this.props.searchChanged(this.state.search, this.state.selected);
                    });
                  }
                );
              }}
              selected={this.state.selected}
              tabs={this.props.tabs}
            />
            <TabKeyboardHelpWidget />
          </S.Top>
          <S.Search>
            <ControlledSearchWidget
              historyContext="cmd-palette"
              focusOnMount={true}
              inputRef={this.searchInputRef}
              searchChanged={(search) => {
                this.setState(
                  {
                    search: search
                  },
                  () => {
                    _.defer(() => {
                      this.props.searchChanged(this.state.search, this.state.selected);
                    });
                  }
                );
              }}
            />
          </S.Search>
          <S.Content
            onWheel={() => {
              this.props.wheelScroll();
            }}
            larger={larger}
          >
            {this.props.children}
          </S.Content>
        </S.Container>
      </FloatingPanelWidget>
    );
  }
}
