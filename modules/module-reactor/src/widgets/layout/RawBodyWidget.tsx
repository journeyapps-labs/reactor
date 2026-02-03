import * as React from 'react';
import { useEffect } from 'react';
import { theme } from '../../stores/themes/reactor-theme-fragment';
import { css, Global, ThemeProvider } from '@emotion/react';
import { ioc } from '../../inversify.config';
import { ThemeStore } from '../../stores/themes/ThemeStore';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { LayersWidget } from '../../stores/layer/LayersWidget';
import { NotificationsLayerWidget } from '../notifications/NotificationsLayerWidget';
import { ComboBoxLayer } from '../../layers/combo/ComboBoxLayer';
import { ComboBox2Layer } from '../../layers/combo2/ComboBox2Layer';
import { CMDPalletLayer } from '../../layers/command-pallet/CMDPalletLayer';
import { DialogLayer } from '../../layers/dialog/DialogLayer';
import { DialogLayer2 } from '../../layers/dialog2/DialogLayer2';
import { KeyCommandDialogLayer } from '../../layers/keys-dialog/KeyCommandDialogLayer';
import { GuideLayer } from '../../layers/guide/GuideLayer';
import { Fonts } from '../../fonts';

export interface RawBodyWidgetProps {
  logo: string;
}

export const RawBodyWidget: React.FC<React.PropsWithChildren<RawBodyWidgetProps>> = observer((props) => {
  useEffect(() => {
    [
      new ComboBoxLayer(),
      new ComboBox2Layer(),
      new CMDPalletLayer(),
      new DialogLayer(),
      new DialogLayer2(),
      new KeyCommandDialogLayer(),
      new GuideLayer()
    ].forEach((l) => l.install());
  }, []);

  const themeStore = ioc.get(ThemeStore);
  return (
    <>
      <Global styles={S.globalStyles} />
      <Global
        styles={css`
          .tooltip-red {
            --balloon-color: ${themeStore.getCurrentTheme(theme).status.failed};
          }
        `}
      />
      <ThemeProvider theme={toJS(themeStore.getCurrentTheme())}>
        {props.children}
        <LayersWidget />
        <NotificationsLayerWidget />
      </ThemeProvider>
    </>
  );
});
namespace S {
  export const globalStyles = css`
    * {
      box-sizing: border-box;
      margin: 0;
      outline: none;
    }

    html {
      overflow: hidden;
    }

    html,
    body,
    #application {
      height: 100%;
      width: 100%;
      position: fixed;
      font-family: ${Fonts.PRIMARY};
    }
    [aria-label][data-balloon-pos]:before {
      z-index: 2;
    }

    [aria-label][data-balloon-pos]:after {
      z-index: 2;
    }
  `;
}
