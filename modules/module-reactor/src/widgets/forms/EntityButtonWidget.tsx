import * as React from 'react';
import { ioc } from '../../inversify.config';
import { PanelButtonMode, PanelButtonWidget } from './PanelButtonWidget';
import { System } from '../../core/System';
import { styled } from '../../stores/themes/reactor-theme-fragment';

export interface EntityButtonWidgetProps<T> {
  entity: T;
  emptyMessage?: string;
  onChange: (entity: T) => any;
  entityType: string;
  allowClearing?: boolean;
  className?: any;
  showTypeLabel?: boolean;
  parent?: any;
}

export function EntityButtonWidget<T>(props: EntityButtonWidgetProps<T>): React.JSX.Element {
  const definition = ioc.get(System).getDefinition<T>(props.entityType);
  let name = props.emptyMessage || '(select)';
  let icon = definition.icon;
  if (props.entity) {
    const description = definition.describeEntity(props.entity);
    name = description.simpleName;
    icon = description.icon;
  }

  return (
    <S.Container className={props.className}>
      {props.showTypeLabel ? <S.TypeLabel>{definition.label}:</S.TypeLabel> : null}
      <PanelButtonWidget
        icon={icon}
        label={name}
        action={async (event) => {
          const selected = await definition.resolveOneEntity({ event, parent: props.parent });
          if (!selected) {
            return;
          }
          props.onChange(selected);
        }}
      />
      {(props.allowClearing ?? true) && props.entity ? (
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

  export const TypeLabel = styled.div`
    color: ${(p) => p.theme.text.secondary};
    padding-right: 5px;
    font-size: 12px;
  `;
}
