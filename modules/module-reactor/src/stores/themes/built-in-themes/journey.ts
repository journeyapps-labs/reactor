import { theme } from '../reactor-theme-fragment';
import { DarkTheme } from './reactor';
import { Themes } from '../ThemeStore';

theme.addThemeValues({
  name: Themes.JOURNEY,
  values: {
    ...DarkTheme,
    canvas: {
      background: '#253238',
      grid: '#33444c'
    },
    workspace: {
      ...DarkTheme.workspace,
      background: '#1f2a31',
      overlayBackground: 'rgba(32,45,51,0.4)',
      overlayBorder: 'rgba(0,192,255,0)',
      overlayBackgroundHover: 'rgba(32,45,51,0.8)',
      overlayBorderHover: 'rgb(255,100,0)',
      overlayDividerColor: 'rgb(255,100,0)',
      overlayDividerHover: 'rgb(255,100,0)'
    },
    panels: {
      ...DarkTheme.panels,
      iconBackground: '#2c3b42',
      background: '#33444c',
      divider: '#41565f',
      trayBackground: '#29373f',
      titleBackground: '#3f545e',
      searchBackground: '#2f3f47',
      searchForeground: '#cad7de',
      tabForeground: '#a6bcc7',
      tabForegroundSelected: '#ffe7d1',
      tabBackgroundSelected: 'rgba(255,100,0,0.16)',
      itemIconColorSelected: '#ff8c2b',
      scrollBar: 'rgba(202,215,222,0.35)',
      trayButton: 'rgba(255,255,255,0.05)',
      trayButtonSelected: 'rgba(0,0,0,0.32)'
    },
    tabs: {
      selectedAccentSingle: '#ff8c2b',
      selectedBackground: 'rgba(255,100,0,0.14)',
      selectedAccent: '#ff8c2b'
    },
    guide: {
      accent: 'rgb(184 107 255)',
      tooltipBackground: 'hsl(285deg 36% 23%)',
      accentText: '#fff',
      startButton: '#546e79',
      startButtonText: '#fff'
    },
    footer: {
      background: '#253238'
    },
    header: {
      ...DarkTheme.header,
      backgroundLogo: 'rgba(255,255,255,0.07)',
      backgroundLogoHover: 'rgba(255,255,255,0.15)',
      background: '#253238'
    },
    changelog: {
      codeForeground: 'white',
      codeBackground: 'rgba(255,255,255,0.1)'
    },
    status: {
      ...DarkTheme.status,
      failed: 'rgb(141,49,73)',
      cardBackground: '#29373f'
    },
    cards: {
      background: '#26343a',
      foreground: '#d6e2e9',
      border: '#4a626d'
    },
    meta: {
      background: 'rgba(204,178,148,0.18)',
      foreground: '#e9dfd2'
    },
    table: {
      ...DarkTheme.table,
      text: 'rgba(227,238,244,0.84)',
      odd: '#39505a',
      pills: '#58727d',
      pillsSpecial: '#ff7a1a',
      columnBackground: '#24333b',
      columnForeground: '#eef4f7'
    },
    text: {
      primary: '#edf4f8',
      secondary: '#b6c9d2'
    },
    button: {
      background: '#29373f',
      border: '#6f8792',
      colorHover: 'white',
      color: '#d9e4ea',
      icon: 'rgba(255,255,255,0.4)'
    },
    buttonPrimary: {
      background: '#29373f',
      border: 'rgb(255,100,0)',
      colorHover: 'white',
      color: '#e5edf1',
      icon: 'rgb(255,100,0)'
    },
    forms: {
      ...DarkTheme.forms,
      checkbox: '#3a4d55',
      checkboxChecked: 'rgb(255,100,0)',
      inputBackground: '#2f3f47',
      inputForeground: '#edf4f8',
      inputBorder: '#5d7581',
      toggleOnColor: 'rgb(255,100,0)',
      toggleHandleColor: '#fff'
    },
    combobox: {
      ...DarkTheme.combobox,
      border: '#5f7985',
      background: '#33444c',
      backgroundSelected: '#3f545e',
      headerBackground: '#3f545e'
    }
  }
});
