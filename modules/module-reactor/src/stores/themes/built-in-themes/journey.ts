import { theme } from '../reactor-theme-fragment';
import { DarkTheme } from './reactor';
import { Themes } from '../ThemeStore';

theme.addThemeValues({
  name: Themes.JOURNEY,
  values: {
    ...DarkTheme,
    canvas: {
      background: 'rgb(38, 50, 56)',
      grid: 'rgb(40,56,64)'
    },
    workspace: {
      ...DarkTheme.workspace,
      background: '#1b2328',
      overlayBackground: 'rgba(32,45,51,0.4)',
      overlayBorder: 'rgba(0,192,255,0)',
      overlayBackgroundHover: 'rgba(32,45,51,0.8)',
      overlayBorderHover: 'rgb(255,100,0)',
      overlayDividerColor: 'rgb(255,100,0)',
      overlayDividerHover: 'rgb(255,100,0)'
    },
    panels: {
      ...DarkTheme.panels,
      iconBackground: 'rgb(55,71,79)',
      background: 'rgb(55,71,79)',
      divider: '#273239',
      trayBackground: 'rgb(32,45,51)',
      titleBackground: 'rgb(69,90,100)',
      searchBackground: 'rgba(38, 50, 56, 1)',
      searchForeground: 'rgba(144, 164, 174, 1)',
      tabForeground: 'rgba(144, 164, 174, 1)',
      tabForegroundSelected: 'white',
      tabBackgroundSelected: 'rgb(32,45,51)',
      itemIconColorSelected: 'rgb(0,192,255)'
    },
    tabs: {
      selectedAccentSingle: 'rgb(255,100,0)',
      selectedBackground: 'rgb(32,45,51)',
      selectedAccent: 'rgb(255,100,0)'
    },
    guide: {
      accent: 'rgb(184 107 255)',
      tooltipBackground: 'hsl(285deg 36% 23%)',
      accentText: '#fff',
      startButton: '#546e79',
      startButtonText: '#fff'
    },
    footer: {
      background: '#273239'
    },
    header: {
      ...DarkTheme.header,
      backgroundLogo: 'rgba(255,255,255,0.07)',
      backgroundLogoHover: 'rgba(255,255,255,0.15)',
      background: '#273239'
    },
    changelog: {
      codeForeground: 'white',
      codeBackground: 'rgba(255,255,255,0.1)'
    },
    status: {
      ...DarkTheme.status,
      failed: 'rgb(141,49,73)',
      cardBackground: 'rgb(32,45,51)'
    },
    cards: {
      background: 'rgba(38, 50, 56, 1)',
      foreground: 'white',
      border: '#4f6772'
    },
    table: {
      ...DarkTheme.table,
      odd: 'rgb(40,56,64)',
      pills: '#476979',
      pillsSpecial: 'rgb(255 100 0)'
    },
    text: {
      primary: 'white',
      secondary: 'rgba(144, 164, 174, 1)'
    },
    button: {
      background: '#273239',
      border: 'rgba(144, 164, 174, 1)',
      colorHover: 'white',
      color: 'rgba(210,210,210)',
      icon: 'rgba(255,255,255,0.3)'
    },
    buttonPrimary: {
      background: '#273239',
      border: 'rgb(255,100,0)',
      colorHover: 'white',
      color: 'rgba(210,210,210)',
      icon: 'rgb(255,100,0)'
    },
    forms: {
      ...DarkTheme.forms,
      checkbox: '#333',
      checkboxChecked: 'white',
      inputBackground: 'rgb(40 57 65)',
      inputForeground: 'white',
      inputBorder: '#5e6675',
      toggleOnColor: 'rgb(0,192,255)',
      toggleHandleColor: '#fff'
    },
    combobox: {
      ...DarkTheme.combobox,
      border: '#556e7a',
      background: 'rgba(55, 71, 79, 1)',
      headerBackground: 'rgb(69,90,100)'
    }
  }
});
