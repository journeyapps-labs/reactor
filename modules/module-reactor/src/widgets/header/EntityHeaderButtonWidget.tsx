import * as React from 'react';
import { useEffect, useState } from 'react';
import { HeaderButtonWidget } from './HeaderButtonWidget';
import { System } from '../../core/System';
import { ioc } from '../../inversify.config';
import { ActionSource } from '../../actions/Action';
import { EncodedEntity } from '../../entities/components/encoder/EntityEncoderComponent';
import { EntityDescription } from '../../entities/components/meta/EntityDescriberComponent';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { IconWidget } from '../icons/IconWidget';

export interface EntityHeaderButtonWidgetProps {
  entity: EncodedEntity;
  remove: () => any;
  vertical: boolean;
}

export const EntityHeaderButtonWidget: React.FC<EntityHeaderButtonWidgetProps> = (props) => {
  const def = ioc.get(System).getDefinition(props.entity.type);
  const [meta, setMeta] = useState<EntityDescription>(null);
  useEffect(() => {
    if (!!props.entity && !def) {
      props.remove();
      return;
    }
    def
      .decode(props.entity)
      .then((e) => {
        setMeta(def.describeEntity(e));
      })
      .catch(() => {
        props.remove();
      });
  }, [props.entity]);

  if (!meta) {
    return (
      <S.Loading>
        <IconWidget icon={'refresh'} spin={true} />
      </S.Loading>
    );
  }

  return (
    <HeaderButtonWidget
      vertical={props.vertical}
      remove={props.remove}
      badgeColor={meta.iconColor}
      btn={{
        tooltip: meta.simpleName,
        action: async (event) => {
          def.decode(props.entity).then((e) => {
            def.selectEntity({
              entity: e,
              source: ActionSource.BUTTON,
              position: event
            });
          });
        },
        icon: meta.icon
      }}
    />
  );
};

namespace S {
  export const Loading = styled.div`
    min-width: 32px;
    min-height: 26px;
    color: wheat;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
}
