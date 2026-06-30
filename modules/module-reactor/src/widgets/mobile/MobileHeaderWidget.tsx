import * as React from 'react';
import { observer } from 'mobx-react';

import { CMDPalletStore } from '../../stores/CMDPalletStore';
import { UXStore } from '../../stores/UXStore';
import { ComboBoxStore2 } from '../../stores/combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { Btn } from '../../definitions/common';
import { ioc } from '../../inversify.config';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';
import { IconWidget } from '../icons/IconWidget';

export interface MobileHeaderWidgetProps {
  logoClicked: (event: React.MouseEvent) => any;
  openDrawer: () => void;
}

namespace S {
  export const Header = themed.div`
    flex-shrink: 0;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
    background: ${(p) => p.theme.header.background};
    color: ${(p) => p.theme.header.foreground};
    font-family: ${Fonts.PRIMARY};
  `;

  export const HeaderLeft = styled.div`
    min-width: 0;
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  export const HeaderRight = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
  `;

  export const IconButton = themed.button`
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 6px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(p) => p.theme.header.foreground};
    background: transparent;
    font-size: 24px;
  `;

  export const Logo = styled.img`
    width: 30px;
    height: 30px;
    object-fit: contain;
  `;

  export const Title = styled.div`
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 15px;
    font-weight: 600;
  `;
}

const btnToComboBoxItem = (btn: Btn, index: number): ComboBoxItem => {
  return {
    key: btn.label || btn.tooltip || `mobile-header-action-${index}`,
    title: btn.label || btn.tooltip || 'Action',
    icon: btn.icon,
    action: async (event) => {
      await btn.action?.(event);
    }
  };
};

export const MobileHeaderWidget: React.FC<MobileHeaderWidgetProps> = observer((props) => {
  const commandPalletStore = ioc.get(CMDPalletStore);
  const comboBoxStore = ioc.get(ComboBoxStore2);
  const uxStore = ioc.get(UXStore);

  const showMobileMenu = async (event: React.MouseEvent) => {
    const items = [
      ...uxStore.headerMetaIcons.map((btn, index) => {
        return {
          ...btnToComboBoxItem(btn, index),
          group: 'Actions'
        };
      }),
      ...Array.from(uxStore.accountButtonOptions.values()).map((item) => {
        return {
          ...item,
          group: item.group || 'Account'
        };
      })
    ];

    if (items.length === 0) {
      return;
    }

    await comboBoxStore.show(
      new SimpleComboBoxDirective({
        items,
        event,
        title: uxStore.account?.name || 'Menu',
        subtitle: uxStore.account?.email
      })
    );
  };

  return (
    <S.Header>
      <S.HeaderLeft>
        <S.IconButton onClick={props.openDrawer}>
          <IconWidget icon="bars" />
        </S.IconButton>
        {uxStore.primaryLogo ? <S.Logo src={uxStore.primaryLogo} onClick={props.logoClicked} /> : null}
        <S.Title>{uxStore.primaryHeader?.label}</S.Title>
      </S.HeaderLeft>
      <S.HeaderRight>
        <S.IconButton onClick={() => commandPalletStore.showPallet(true)}>
          <IconWidget icon="search" />
        </S.IconButton>
        <S.IconButton onClick={showMobileMenu}>
          <IconWidget icon="ellipsis-v" />
        </S.IconButton>
      </S.HeaderRight>
    </S.Header>
  );
});
