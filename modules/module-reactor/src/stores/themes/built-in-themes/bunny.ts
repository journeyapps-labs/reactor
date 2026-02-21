import { theme } from '../reactor-theme-fragment';
import { DarkTheme } from './reactor';
import { Themes } from '../ThemeStore';

export const Bunny = theme.addThemeValues({
  name: Themes.BUNNY,
  values: {
    ...DarkTheme,
    canvas: {
      background: '#1b1730',
      grid: '#2a2340'
    },
    workspace: {
      ...DarkTheme.workspace,
      background: '#171328',
      overlayBackground: 'rgba(34, 26, 56, 0.45)',
      overlayBackgroundHover: 'rgba(34, 26, 56, 0.78)',
      overlayBorder: 'rgba(0,0,0,0)',
      overlayBorderHover: '#b68cff',
      overlayDividerColor: '#8c5dff',
      overlayDividerHover: '#c5a1ff'
    },
    panels: {
      ...DarkTheme.panels,
      iconBackground: '#241d3b',
      trayBackground: '#171228',
      background: '#201834',
      titleBackground: '#281f42',
      divider: '#32294d',
      searchBackground: '#2c2345',
      searchForeground: '#f3ebff',
      tabForeground: 'rgba(236,224,255,0.6)',
      tabForegroundSelected: '#fff',
      tabBackgroundSelected: '#2a2143',
      itemIconColorSelected: '#bd93ff',
      titleForeground: '#f6eeff',
      scrollBar: 'rgba(197,161,255,0.35)',
      trayButton: 'rgba(255,255,255,0.05)',
      trayButtonSelected: 'rgba(141,96,255,0.22)'
    },
    meta: {
      background: 'rgba(255,255,255,0.1)',
      foreground: '#efe6ff'
    },
    icons: {
      dualIconBackground: 'rgba(0,0,0,0.42)',
      color: '#f0e7ff'
    },
    trees: {
      ...DarkTheme.trees,
      labelColor: '#f0e7ff',
      selectedBackground: 'rgba(142, 104, 255, 0.26)'
    },
    guide: {
      accent: '#c98cff',
      tooltipBackground: 'hsl(263deg 36% 20%)',
      accentText: '#1d1129',
      startButton: 'linear-gradient(135deg, #8a63ff 0%, #e37fff 100%)',
      startButtonText: '#fff'
    },
    cards: {
      background: '#201834',
      foreground: '#e8ddff',
      border: '#40305f',
      tagBackground: '#5f5378',
      tagLabelBackground: 'rgba(0, 0, 0, 0.1)',
      tagLabelForeground: 'rgba(242, 236, 255, 0.92)'
    },
    status: {
      cardBackground: '#1c162d',
      failed: '#a93b80',
      failedForeground: '#fff',
      loading: '#9f7bff',
      success: '#5ca978',
      successForeground: '#fff'
    },
    header: {
      ...DarkTheme.header,
      background: '#171328',
      primary: '#d1a6ff',
      secondary: '#8c5dff',
      backgroundLogo: '#0f0b19',
      backgroundLogoHover: '#1d1530',
      foreground: '#f6eeff'
    },
    footer: {
      background: '#171328'
    },
    combobox: {
      textSelected: '#fff',
      headerForeground: '#fff',
      background: '#201834',
      backgroundSelected: '#4a3578',
      text: '#efe6ff',
      border: '#382b57',
      headerBackground: '#332756',
      shadowColor: 'rgba(0, 0, 0, 0.55)'
    },
    tabs: {
      selectedAccentSingle: '#b98fff',
      selectedAccent: 'linear-gradient(145deg, #8c5dff, #e07cff)',
      selectedBackground: 'rgba(141,96,255,0.2)'
    },
    visor: {
      background: 'rgba(0, 0, 0, 0.28)'
    },
    button: {
      background: '#1a1430',
      border: '#3b2b5b',
      color: 'rgba(240,231,255,0.88)',
      colorHover: '#fff',
      icon: 'rgba(201,161,255,0.7)'
    },
    buttonLink: {
      background: 'transparent',
      border: 'transparent',
      color: 'rgba(240,231,255,0.84)',
      colorHover: '#fff',
      icon: 'rgba(201,161,255,0.7)'
    },
    buttonPrimary: {
      background: '#271b41',
      border: '#b889ff',
      color: 'rgba(255,255,255,0.95)',
      colorHover: '#fff',
      icon: '#caa3ff'
    },
    text: {
      primary: 'rgba(244,236,255,0.9)',
      secondary: 'rgba(219,202,245,0.72)'
    },
    forms: {
      ...DarkTheme.forms,
      checkbox: '#35294f',
      checkboxChecked: '#b889ff',
      inputForeground: '#f4ecff',
      inputBackground: '#221b39',
      inputBorder: '#3e305e',
      toggleOnColor: '#a778ff',
      toggleHandleColor: '#fff',
      groupBorder: 'rgba(187,146,255,0.3)',
      groupLabelForeground: '#efe4ff',
      description: '#bba9d9'
    },
    table: {
      text: 'rgba(240,231,255,0.86)',
      odd: '#261f3d',
      pills: '#33284c',
      pillsSpecial: '#7f5bcc',
      columnBackground: 'rgba(24,18,40,0.62)',
      columnForeground: '#f1e8ff'
    },
    floating: {
      background: 'rgba(32,24,54,0.86)',
      backgroundInactive: 'rgba(32,24,54,0.55)',
      border: 'rgba(197,161,255,0.35)'
    }
  }
});
