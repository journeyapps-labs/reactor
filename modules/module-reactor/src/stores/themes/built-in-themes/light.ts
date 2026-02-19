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
      background: '#f2f4f7',
      grid: '#dde2e8'
    },
    workspace: {
      background: '#f6f8fb',
      overlayBackground: 'rgba(246,248,251,0.45)',
      overlayBorder: '#a8b3c0',
      overlayBackgroundHover: 'rgba(246,248,251,0.85)',
      overlayBorderHover: '#8f9baa',
      overlayDividerHover: '#2f3b4b',
      overlayDividerColor: '#a8b3c0'
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
      iconBackground: '#edf1f6',
      trayBackground: '#e7ebf1',
      background: '#f8fafc',
      titleBackground: '#e2e7ef',
      divider: '#b5c0cd',
      searchBackground: '#e5eaf1',
      searchForeground: '#2d3746',
      tabForeground: 'rgba(45,55,70,0.65)',
      tabForegroundSelected: '#1f2936',
      tabBackgroundSelected: '#ffffff',
      itemIconColorSelected: '#6a7482',
      titleForeground: '#1f2936',
      scrollBar: '#9fb0c4',
      trayButton: '#edf1f6',
      trayButtonSelected: '#d8dfe9'
    },
    meta: {
      background: '#e8ebf0',
      foreground: '#273446'
    },
    icons: {
      dualIconBackground: 'rgba(255,255,255,0.8)',
      color: '#000'
    },
    trees: {
      labelColor: '#202b39',
      selectedBackground: '#dce7f5'
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
      background: '#f5f7fa',
      foreground: '#283445',
      border: '#b2bdcb',
      tagBackground: '#94a1b3',
      tagLabelBackground: 'rgba(0, 0, 0, 0.16)',
      tagLabelForeground: 'rgba(255, 255, 255, 0.95)'
    },
    status: {
      cardBackground: '#edf2f8',
      failed: '#d86a86',
      failedForeground: 'white',
      loading: '#2b6e99',
      success: '#78a85c',
      successForeground: 'white'
    },
    header: {
      background: '#e7ebf1',
      primary: '#243042',
      secondary: '#6d7f9a',
      backgroundLogo: '#dbe3ee',
      backgroundLogoHover: '#c8d3e3',
      foreground: '#1f2936'
    },
    changelog: {
      codeForeground: 'rgb(132,221,255)',
      codeBackground: 'rgb(4,33,40)'
    },
    footer: {
      background: '#e7ebf1'
    },
    combobox: {
      textSelected: '#1f2936',
      headerForeground: '#1f2936',
      background: '#f6f8fb',
      backgroundSelected: '#e3e8f0',
      text: '#1f2936',
      border: '#b2bdcb',
      headerBackground: '#e6ebf2',
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    },
    tabs: {
      selectedAccentSingle: '#2f5f8f',
      selectedAccent: '#2f5f8f',
      selectedBackground: '#f1f6fc'
    },
    visor: {
      background: 'rgba(0,0,0,0.2)'
    },
    button: {
      background: '#f5f7fa',
      border: '#b2bdcb',
      color: '#253142',
      colorHover: '#111926',
      icon: 'rgba(37,49,66,0.45)'
    },
    buttonLink: {
      background: 'transparent',
      border: 'transparent',
      color: 'rgba(0,0,0,0.8)',
      colorHover: 'rgb(0,0,0)',
      icon: 'rgba(255, 255, 255 ,0.3)'
    },
    buttonPrimary: {
      background: '#f7fbff',
      border: '#2f5f8f',
      color: '#1d2a3a',
      colorHover: '#0f1724',
      icon: '#2691cd'
    },
    text: {
      primary: '#1f2936',
      secondary: 'rgba(63,74,89,0.88)'
    },
    forms: {
      ...DarkTheme.forms,
      checkbox: '#c8d0dc',
      checkboxChecked: '#1f2936',
      inputForeground: '#1f2936',
      inputBackground: '#f5f7fa',
      inputBorder: '#a9b6c6',
      groupLabelForeground: '#2f3a48',
      toggleOnColor: '#1f2936',
      toggleHandleColor: 'white',
      description: '#646f7d'
    },
    table: {
      text: '#2f3a48',
      odd: '#f3f6fa',
      pills: '#e2e7ee',
      pillsSpecial: '#cfd8e4',
      columnBackground: 'rgba(46,58,72,0.18)',
      columnForeground: '#2f3a48'
    },
    floating: {
      background: 'rgba(245,249,253,0.92)',
      backgroundInactive: 'rgba(245,249,253,0.65)'
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
