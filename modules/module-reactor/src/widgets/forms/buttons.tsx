import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { MouseEvent, useState } from 'react';
import { Btn } from '../../definitions/common';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { IconWidget, ReactorIcon } from '../icons/IconWidget';

namespace S {
  export const Icon = styled(IconWidget)`
    align-self: center;
  `;

  export const FA = styled(FontAwesomeIcon)`
    align-self: center;
  `;
}

export function useSubmit(props: Btn & { submitting?: boolean }): {
  action: (event: MouseEvent) => any;
  blocking: boolean;
} {
  const [block, setBlocking] = useState(false);
  return {
    action: (event: MouseEvent) => {
      if (block || props.submitting || props.disabled) {
        return;
      }
      props.action(event, (loading: boolean) => {
        setBlocking(loading);
      });
    },
    blocking: block
  };
}

export const ButtonWidgetIcon: React.FC<{ loading: boolean; className?; icon: ReactorIcon }> = (props) => {
  if (!props.icon) {
    return null;
  }

  if (props.loading) {
    return <S.FA className={props.className} fixedWidth={true} icon="sync-alt" spin={true} />;
  }
  if (!!props.icon) {
    return <S.Icon className={props.className} icon={props.icon} />;
  }
};
