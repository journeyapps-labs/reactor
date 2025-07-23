import * as React from 'react';
import { IconName, findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type ReactorCharIcon = {
  chars?: string;
};

export type ReactorUrlIcon = {
  url?: string;
};

export type ReactorIcon = ReactorCharIcon | ReactorUrlIcon | IconName;

export interface IconWidgetProps {
  icon: ReactorIcon;
  className?: any;
  spin?: boolean;
}

namespace S {
  export const Icon = styled.div`
    display: inline;
  `;

  export const Image = styled.img``;
}

export const IconWidget: React.FC<IconWidgetProps> = React.memo((props) => {
  if (typeof props.icon === 'object') {
    // text chars
    if ((props.icon as ReactorCharIcon).chars) {
      return <S.Icon className={props.className}>{(props.icon as ReactorCharIcon).chars}</S.Icon>;
    }

    // image
    return <S.Image className={props.className} src={(props.icon as ReactorUrlIcon).url} />;
  }

  let icon: any = props.icon;

  // it might be a brand icon
  try {
    const brand = findIconDefinition({ iconName: props.icon, prefix: 'fab' });
    if (!!brand) {
      icon = ['fab', icon];
    }
  } catch (ex) {}

  return <FontAwesomeIcon className={props.className} icon={icon} spin={props.spin} fixedWidth />;
});
