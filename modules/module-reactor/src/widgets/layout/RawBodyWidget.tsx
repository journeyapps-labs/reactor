import * as React from 'react';
import { useEffect } from 'react';
import { theme } from '../../stores/themes/reactor-theme-fragment';
import { css, Global, ThemeProvider } from '@emotion/react';
import { ioc } from '../../inversify.config';
import { ThemeStore } from '../../stores/themes/ThemeStore';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { LayersWidget } from '../../stores/layer/LayersWidget';
import { ComboBoxLayer } from '../../layers/combo/ComboBoxLayer';
import { ComboBox2Layer } from '../../layers/combo2/ComboBox2Layer';
import { CMDPalletLayer } from '../../layers/command-pallet/CMDPalletLayer';
import { DialogLayer } from '../../layers/dialog/DialogLayer';
import { DialogLayer2 } from '../../layers/dialog2/DialogLayer2';
import { KeyCommandDialogLayer } from '../../layers/keys-dialog/KeyCommandDialogLayer';
import { GuideLayer } from '../../layers/guide/GuideLayer';
import { NotificationLayer } from '../../layers/notifications/NotificationLayer';
import { Fonts } from '../../fonts';
import { REACTOR_MOBILE_MEDIA_QUERY } from '../../hooks/useReactorViewportMode';

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
      new GuideLayer(),
      new NotificationLayer()
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

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      * {
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        user-select: none;
        touch-action: manipulation;
      }

      input,
      textarea,
      select,
      [contenteditable='true'] {
        -webkit-user-select: text;
        font-size: 16px !important;
        user-select: text;
      }

      .reactor-long-press-pending {
        animation: reactor-long-press-pending 430ms ease-out forwards;
        transform-origin: center;
        will-change: transform;
      }
    }

    @keyframes reactor-long-press-pending {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(0.97);
      }
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
