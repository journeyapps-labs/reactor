import { ComboBoxDirective, ComboBoxDirectiveOptions } from '../ComboBoxDirective';

import * as React from 'react';
import styled from '@emotion/styled';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { TabDirective, TabSelectionWidget } from '../../../widgets';
import { ComboBoxItem } from '../../combo/ComboBoxDirectives';

export interface ComposableComboBoxDirectiveOptions<
  T extends ComboBoxItem = ComboBoxItem
> extends ComboBoxDirectiveOptions {
  directives: ComboBoxDirective<T>[];
}

export class ComposableComboBoxDirective<T extends ComboBoxItem = ComboBoxItem> extends ComboBoxDirective<T> {
  @observable
  accessor currentDirective: ComboBoxDirective<T>;

  currentListener: () => any;

  constructor(protected options2: ComposableComboBoxDirectiveOptions<T>) {
    super(options2);
    this.setSelectedTab(options2.directives[0].title);
  }

  get tabs(): TabDirective[] {
    return this.options2.directives.map((directive) => {
      return {
        key: directive.title,
        name: directive.title
      };
    });
  }

  setSelectedTab(tab: string) {
    this.currentListener?.();
    this.currentDirective = this.options2.directives.find((d) => d.title === tab);
    this.currentListener = this.currentDirective.registerListener({
      dismissed: () => {
        this.setSelected(this.currentDirective.getSelected());
      }
    });
  }

  dismiss() {
    super.dismiss();
    this.currentListener?.();
  }

  setSelected(items: T[]) {
    super.setSelected(items);
    this.dismiss();
  }

  getContent(): React.JSX.Element {
    return <ComposableComboBoxDirectiveWidget directive={this} />;
  }
}

export interface ComposableComboBoxDirectiveWidgetProps {
  directive: ComposableComboBoxDirective;
}

export const ComposableComboBoxDirectiveWidget: React.FC<ComposableComboBoxDirectiveWidgetProps> = observer((props) => {
  return (
    <>
      <TabSelectionWidget
        tabs={props.directive.tabs}
        selected={props.directive.currentDirective.title}
        tabSelected={(tab) => {
          props.directive.setSelectedTab(tab);
        }}
      />
      <S.Container key={props.directive.currentDirective.title}>
        {props.directive.currentDirective.getContent()}
      </S.Container>
    </>
  );
});

namespace S {
  export const Container = styled.div`
    padding-top: 10px;
  `;
}
