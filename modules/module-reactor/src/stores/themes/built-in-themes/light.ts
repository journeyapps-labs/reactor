import { theme } from '../reactor-theme-fragment';
import { Themes, ThemeStore } from '../ThemeStore';
import { DarkTheme } from './reactor';
import { ioc } from '../../../inversify.config';
import { System } from '../../../core/System';

theme.addThemeValues({
  name: Themes.REACTOR_LIGHT,
  values: {
    plan: {
      background: '#00945b',
      foreground: 'white',
      border: '#c5306e'
    },
    canvas: {
      background: '#f1f1f1',
      grid: '#dcdcdc'
    },
    workspace: {
      background: '#fff',
      overlayBackground: 'rgba(255,255,255,0.2)',
      overlayBorder: '#9370db',
      overlayBackgroundHover: 'rgba(255,255,255,0.7)',
      overlayBorderHover: '#9370db',
      overlayDividerHover: '#000',
      overlayDividerColor: '#9370db'
    },
    tooltips: {
      background: 'rgb(87,87,87)',
      foreground: '#fff'
    },
    dnd: {
      hintColor: 'red',
      hoverColor: 'red'
    },
    panels: {
      iconBackground: '#ffffff',
      trayBackground: '#f1f1f1',
      background: '#f8f8f8',
      titleBackground: '#e7e7e7',
      divider: '#cecece',
      searchBackground: '#dadada',
      searchForeground: 'black',
      tabForeground: 'rgba(0,0,0,0.5)',
      tabForegroundSelected: 'black',
      tabBackgroundSelected: '#ffffff',
      itemIconColorSelected: 'rgb(0,192,255)',
      titleForeground: '#000',
      scrollBar: '#a8a8a8',
      trayButton: 'white',
      trayButtonSelected: 'rgb(230,230,230)'
    },
    meta: {
      background: 'rgba(255,255,255,0.8)',
      foreground: '#000'
    },
    icons: {
      dualIconBackground: 'rgba(255,255,255,0.8)',
      color: '#000'
    },
    trees: {
      labelColor: '#000',
      selectedBackground: '#d9d9d9'
    },
    guide: {
      accent: '#ff6a1a',
      tooltipBackground: 'hsl(21deg 58% 16%)',
      accentText: '#000',
      startButton: '#fff',
      startButtonText: '#000'
    },
    graphs: {
      grid: 'rgb(180,180,180)',
      line: 'rgb(0,0,0)',
      fillStop1: 'rgba(0,0,0,0.4)',
      fillStop2: 'rgba(0,0,0,0.4)',
      fillStop3: 'rgba(0,0,0,0.4)',
      thresholdLine: '#b92900'
    },
    cards: {
      background: '#ededed',
      foreground: 'rgb(45,45,45)',
      border: 'rgb(182 182 182)'
    },
    status: {
      cardBackground: '#e8e8e8',
      failed: '#ea6d6d',
      failedForeground: 'white',
      loading: '#165e8c',
      success: '#a6cb7e',
      successForeground: 'white'
    },
    header: {
      background: '#ececec',
      primary: '#000000',
      secondary: '#9370db',
      backgroundLogo: '#13171c',
      backgroundLogoHover: '#000000',
      foreground: '#000'
    },
    changelog: {
      codeForeground: 'rgb(132,221,255)',
      codeBackground: 'rgb(4,33,40)'
    },
    footer: {
      background: '#eeeeee'
    },
    combobox: {
      textSelected: '#000',
      headerForeground: 'white',
      background: '#eaeaea',
      backgroundSelected: 'rgb(220,220,220)',
      text: 'rgb(0,0,0)',
      border: '#929292',
      headerBackground: '#f1f1f1',
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    },
    tabs: {
      selectedAccentSingle: '#000000',
      selectedAccent: '#000000',
      selectedBackground: '#f8f8f8'
    },
    visor: {
      background: 'rgba(0,0,0,0.2)'
    },
    button: {
      background: '#f3f3f3',
      border: '#a2a2a2',
      color: 'rgba(0,0,0,0.8)',
      colorHover: 'black',
      icon: 'rgba(0,0,0,0.3)'
    },
    buttonLink: {
      background: 'transparent',
      border: 'transparent',
      color: 'rgba(0,0,0,0.8)',
      colorHover: 'rgb(0,0,0)',
      icon: 'rgba(255, 255, 255 ,0.3)'
    },
    buttonPrimary: {
      background: '#ffffff',
      border: 'rgb(0,80,115)',
      color: 'rgba(0,0,0,0.8)',
      colorHover: 'black',
      icon: 'rgb(0,192,255)'
    },
    text: {
      primary: 'rgba(0,0,0,0.8)',
      secondary: 'rgba(52,52,52,0.5)'
    },
    forms: {
      ...DarkTheme.forms,
      checkbox: '#c3c3c3',
      checkboxChecked: 'rgb(0,0,0)',
      inputForeground: 'black',
      inputBackground: '#e3e3e3',
      inputBorder: '#aaaaaa',
      toggleOnColor: 'rgb(0,0,0)',
      toggleHandleColor: 'white',
      description: 'rgb(118 120 124)'
    },
    table: {
      text: '#333',
      odd: '#ededed',
      pills: '#dbdbdb',
      pillsSpecial: 'rgb(187 187 187)',
      columnBackground: 'rgba(0, 0, 0, 0.1)',
      columnForeground: '#000'
    },
    floating: {
      background: 'rgba(255,255,255,0.8)',
      backgroundInactive: 'rgba(255,255,255,0.45)'
    }
  }
});

export const patchLightThemeEntityColors = () => {
  ioc.get(ThemeStore).fragments.forEach((f) => {
    f.addEntityThemeOverride({
      name: Themes.REACTOR_LIGHT,
      entities: Array.from(ioc.get(System).definitions.keys()).reduce((prev, cur) => {
        prev[cur] = { iconColor: '#333' };
        return prev;
      }, {})
    });
  });
};
