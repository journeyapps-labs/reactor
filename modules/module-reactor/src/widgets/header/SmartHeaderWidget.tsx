import * as React from 'react';
import { HeaderWidget } from './HeaderWidget';
import { inject } from '../../inversify.config';
import { System } from '../../core/System';
import { observer } from 'mobx-react';
import { PrefsStore } from '../../stores/PrefsStore';
import { UXStore } from '../../stores/UXStore';
import { ToolbarPosition, ToolbarPreference } from '../../settings/ToolbarPreference';
import { Btn } from '../../definitions/common';
import { ComboBoxStore2 } from '../../stores/combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../../stores/combo2/directives/SimpleComboBoxDirective';

export interface SmartHeaderWidgetProps {
  logoClicked: (event: React.MouseEvent) => any;
  forwardRef: React.RefObject<HTMLDivElement>;
  additionalLeftButtons?: Btn[];
  email: string;
  name: string;
  rightContent?: React.JSX.Element;
  className?: any;
}

@observer
export class SmartHeaderWidget extends React.Component<SmartHeaderWidgetProps> {
  @inject(PrefsStore)
  accessor prefsStore: PrefsStore;

  @inject(System)
  accessor application: System;

  @inject(UXStore)
  accessor uxStore: UXStore;

  @inject(ComboBoxStore2)
  accessor comboBoxStore: ComboBoxStore2;

  render() {
    const rightPref = this.prefsStore.getPreference<ToolbarPreference>(ToolbarPosition.HEADER_RIGHT);
    const meta = this.uxStore.headerMetaIcons;

    return (
      <HeaderWidget
        className={this.props.className}
        email={this.props.email}
        name={this.props.name}
        leftButtons={this.props.additionalLeftButtons}
        forwardRef={this.props.forwardRef}
        primaryHeading={this.uxStore.primaryHeader}
        secondaryHeading={this.uxStore.secondaryHeader}
        additionalLogo={this.uxStore.primaryLogo}
        logoClicked={this.props.logoClicked}
        toolbar={rightPref}
        rightContent={this.props.rightContent}
        metaButtons={meta}
        accountButton={{
          action: async (event) => {
            await this.comboBoxStore.show(
              new SimpleComboBoxDirective({
                items: Array.from(this.uxStore.accountButtonOptions.values()),
                event,
                title: this.uxStore.account?.name,
                subtitle: this.uxStore.account?.email
              })
            );
          }
        }}
      />
    );
  }
}
