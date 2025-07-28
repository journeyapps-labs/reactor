import * as React from 'react';
import styled from '@emotion/styled';
import { ioc } from '../../inversify.config';
import { PanelButtonMode, PanelButtonWidget } from './PanelButtonWidget';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { System } from '../../core/System';

export interface ProviderButtonWidgetProps<T> {
  value: T;
  emptyMessage?: string;
  onChange: (value: T) => any;
  entityType: string;
  allowClearing?: boolean;
}

/**
 * @deprecated use EntityButtonWidget instead
 */
export function ProviderButtonWidget<T>(props: ProviderButtonWidgetProps<T>): React.JSX.Element {
  const provider = ioc.get(System).getProvider(props.entityType);
  let name = props.emptyMessage || '(select)';
  let serialized = null;
  if (props.value) {
    serialized = provider.serialize(props.value);
    name = serialized.display;
  }

  return (
    <S.Container>
      <PanelButtonWidget
        icon={provider.getIcon(serialized)}
        label={name}
        action={async (event) => {
          const selected = await ioc.get(ComboBoxStore).showSearchComboBoxForProvider<T>(provider, event);
          if (!selected) {
            return;
          }
          props.onChange(selected);
        }}
      />
      {(props.allowClearing ?? true) && props.value ? (
        <PanelButtonWidget
          mode={PanelButtonMode.LINK}
          icon="times"
          action={(event) => {
            props.onChange(null);
          }}
        />
      ) : null}
    </S.Container>
  );
}

namespace S {
  export const Container = styled.div`
    display: flex;
    align-items: center;
  `;
}
