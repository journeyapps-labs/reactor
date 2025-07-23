import * as React from 'react';
import { useRef } from 'react';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { Btn } from '../../definitions/common';
import { IconWidget } from '../icons/IconWidget';
import { AttentionWrapperWidget } from '../guide/AttentionWrapperWidget';
import { observer } from 'mobx-react';
import { ButtonComponentSelection, ReactorComponentType } from '../../stores/guide/selections/common';

namespace S {
  export const MetaButton = styled.div<{ selected: boolean }>`
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(p) => p.theme.header.foreground};
    font-size: 16px;
    cursor: pointer;
    opacity: ${(p) => (p.selected ? 1 : 0.3)};
    padding-left: 7px;
    padding-right: 7px;
    border: solid 1px ${(p) => (p.selected ? p.theme.guide.accent : 'transparent')};
    border-radius: 5px;

    &:hover {
      opacity: 1;
    }
  `;

  export const Icon = styled(IconWidget)`
    max-height: 16px;
  `;
}

export const MetaButton = observer<React.FC<{ btn: Btn }>>(({ btn }) => {
  const ref = useRef(null);

  const tooltip = btn.tooltip || btn.label;
  return (
    <AttentionWrapperWidget<ButtonComponentSelection>
      selection={{
        label: tooltip
      }}
      forwardRef={ref}
      type={ReactorComponentType.HEADER_BUTTON}
      activated={(selected) => {
        return (
          <S.MetaButton
            ref={ref}
            selected={!!selected}
            onClick={(event) => {
              event.persist();
              btn.action(event);
            }}
            key={tooltip}
            aria-label={tooltip}
            data-balloon-pos="down"
          >
            <S.Icon icon={btn.icon} />
          </S.MetaButton>
        );
      }}
    />
  );
});
