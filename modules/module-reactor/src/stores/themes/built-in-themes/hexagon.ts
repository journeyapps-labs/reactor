import { theme } from '../reactor-theme-fragment';
import { Themes } from '../ThemeStore';
import { DarkTheme } from './reactor';

theme.addThemeValues({
  name: Themes.HEXAGON,
  values: {
    ...DarkTheme,
    canvas: {
      background: '#2C2C2E',
      grid: '#252526'
    },
    workspace: {
      ...DarkTheme.workspace,
      background: 'rgb(22 22 22)'
    },
    panels: {
      ...DarkTheme.panels,
      iconBackground: 'rgb(35,35,37)',
      background: 'rgba(34, 34, 36, 1)',
      divider: 'rgb(25,25,26)',
      trayBackground: 'rgba(30,30,30, 1)',
      titleBackground: 'rgba(58, 58, 60, 1)',
      searchBackground: 'rgba(28, 28, 30, 1)',
      searchForeground: 'rgba(174, 174, 178, 1)',
      tabForeground: 'rgba(174, 174, 178, 0.62)',
      tabForegroundSelected: 'white',
      tabBackgroundSelected: 'rgba(28, 28, 30, 1)',
      itemIconColorSelected: 'rgb(0,192,255)',
      trayButton: 'rgba(0, 0, 0, 0.28)',
      trayButtonSelected: 'rgb(34 34 36)'
    },
    header: {
      ...DarkTheme.header,
      backgroundLogo: 'rgba(255,255,255,0.07)',
      backgroundLogoHover: 'rgba(255,255,255,0.15)',
      background: 'rgb(25,25,26)'
    },
    guide: {
      accent: '#ff8f00',
      tooltipBackground: 'hsl(41deg 35% 22%)',
      accentText: '#000',
      startButton: 'linear-gradient(131deg, rgba(255,143,0,1) 0%, rgba(255,23,68,1) 100%)',
      startButtonText: '#ffffff'
    },
    footer: {
      background: 'rgba(44, 44, 46, 1)'
    },
    tabs: {
      selectedAccentSingle: '#ff8f00',
      selectedAccent: 'linear-gradient(155deg, #ff8f00, #ff1744)',
      selectedBackground: 'linear-gradient(155deg, rgba(255, 143, 0, 0.2), rgba(255, 23, 68,0.2))'
    },
    changelog: {
      codeForeground: 'white',
      codeBackground: 'rgba(255,255,255,0.1)'
    },
    status: {
      ...DarkTheme.status,
      success: 'rgb(145,204,56)',
      failed: '#ff1744',
      cardBackground: '#262628'
    },
    trees: {
      ...DarkTheme.trees,
      selectedBackground: 'linear-gradient(155deg, rgba(255, 143, 0, 0.2), rgba(255, 23, 68,0.2))'
    },
    cards: {
      background: 'rgba(58, 58, 60, 1)',
      foreground: 'white',
      border: 'rgb(95 95 95)',
      tagBackground: '#696a6c',
      tagLabelBackground: 'rgba(0, 0, 0, 0.14)',
      tagLabelForeground: 'rgba(255, 255, 255, 0.92)'
    },
    table: {
      ...DarkTheme.table,
      odd: '#29292a',
      pills: '#4b4b4d',
      pillsSpecial: 'linear-gradient(155deg, #ff8f00, #ff1744)'
    },
    text: {
      primary: 'white',
      secondary: 'rgba(174, 174, 178, 0.72)'
    },
    button: {
      background: 'rgb(28,28,30)',
      border: 'transparent',
      colorHover: 'white',
      color: 'rgba(210,210,210)',
      icon: 'rgba(255,255,255,0.3)'
    },
    buttonPrimary: {
      background: '#2d1a00',
      border: '#ff8f00',
      colorHover: 'white',
      color: 'rgba(210,210,210)',
      icon: 'rgba(255,255,255,0.3)'
    },
    forms: {
      ...DarkTheme.forms,
      checkbox: '#333',
      checkboxChecked: '#ff8f00',
      inputBackground: 'rgb(35 35 37)',
      inputBorder: '#434343',
      inputForeground: 'white',
      toggleOnColor: '#ff8f00',
      toggleHandleColor: '#fff'
    },
    combobox: {
      ...DarkTheme.combobox,
      headerForeground: 'white',
      textSelected: 'white',
      backgroundSelected: 'linear-gradient(155deg, rgba(255, 143, 0, 0.2), rgba(255, 23, 68,0.2))',
      background: 'rgb(25 25 25)',
      border: '#2a2a2a',
      headerBackground: 'linear-gradient(131deg, rgba(255,143,0,1) 0%, rgba(255,23,68,1) 12%, rgba(44, 44, 46, 1) 43%)'
    },
    floating: {
      background: 'rgba(0, 0, 0, 0.3)',
      backgroundInactive: 'rgba(0, 0, 0, 0.5)',
      border: 'rgba(255, 143, 0, 0.32)'
    }
  }
});
