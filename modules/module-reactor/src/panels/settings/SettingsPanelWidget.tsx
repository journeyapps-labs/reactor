import * as React from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import { PrefsStore } from '../../stores/PrefsStore';
import { inject } from '../../inversify.config';
import { TabDirective } from '../../widgets/tabs/GenericTabSelectionWidget';
import { TabSelectionWidget } from '../../widgets/tabs/TabSelectionWidget';
import * as _ from 'lodash';
import { SettingsPanelModel } from './SettingsPanelFactory';

namespace S {
  export const Content = styled.div`
    height: 100%;
    flex-grow: 1;
    overflow: hidden;
  `;

  export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
  `;

  export const Tabs = styled.div`
    flex-shrink: 0;
  `;
}

export interface SettingsPanelWidgetProps {
  model: SettingsPanelModel;
}

@observer
export class SettingsPanelWidget extends React.Component<SettingsPanelWidgetProps> {
  @inject(PrefsStore)
  accessor prefsStore: PrefsStore;

  constructor(props) {
    super(props);
    if (this.props.model.selectedTab) {
      return;
    }
    const tabs = this.getTabs();
    const first = _.first(tabs);
    if (first) {
      this.props.model.selectedTab = first.key;
    }
  }

  getTabs(): TabDirective[] {
    return _.map(this.prefsStore.categories, (category) => {
      return {
        key: category.key,
        name: category.name
      };
    });
  }

  getContent() {
    if (!this.props.model.selectedTab) {
      return null;
    }
    return this.prefsStore.categories[this.props.model.selectedTab].generateUI();
  }

  render() {
    return (
      <S.Container>
        <S.Tabs>
          <TabSelectionWidget
            tabSelected={(tab) => {
              this.props.model.selectedTab = tab;
            }}
            tabs={this.getTabs()}
            selected={this.props.model.selectedTab}
          />
        </S.Tabs>
        <S.Content>{this.getContent()}</S.Content>
      </S.Container>
    );
  }
}
