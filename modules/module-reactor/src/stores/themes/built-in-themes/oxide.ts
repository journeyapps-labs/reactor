import { theme } from '../reactor-theme-fragment';
import { DarkTheme } from './reactor';
import { Themes } from '../ThemeStore';

theme.addThemeValues({
  name: Themes.OXIDE,
  values: {
    ...DarkTheme,
    canvas: {
      background: '#252526',
      grid: '#2C2C2E'
    },
    workspace: {
      ...DarkTheme.workspace,
      background: '#2d2d2f'
    },
    panels: {
      ...DarkTheme.panels,
      iconBackground: 'rgb(45,45,47)',
      background: 'rgba(44, 44, 46, 1)',
      divider: 'rgb(38,38,40)',
      trayBackground: 'rgba(28, 28, 30, 1)',
      titleBackground: 'rgba(58, 58, 60, 1)',
      searchBackground: 'rgba(28, 28, 30, 1)',
      searchForeground: 'rgba(174, 174, 178, 1)',
      tabForeground: 'rgba(174, 174, 178, 1)',
      tabForegroundSelected: 'white',
      tabBackgroundSelected: 'rgba(28, 28, 30, 1)',
      itemIconColorSelected: 'rgb(0,192,255)'
    },
    header: {
      ...DarkTheme.header,
      backgroundLogo: 'rgba(255,255,255,0.07)',
      backgroundLogoHover: 'rgba(255,255,255,0.15)',
      background: 'rgba(44, 44, 46, 1)'
    },
    trees: {
      ...DarkTheme.trees,
      selectedBackground: 'rgba(255, 255, 255, 0.08)'
    },
    guide: {
      accent: 'rgb(248,171,4)',
      tooltipBackground: 'hsl(41deg 35% 22%)',
      accentText: '#000',
      startButton: '#b0501c',
      startButtonText: '#fff'
    },
    footer: {
      background: 'rgba(44, 44, 46, 1)'
    },
    tabs: {
      selectedAccentSingle: '#fff',
      selectedAccent: '#fff',
      selectedBackground: 'rgba(0,0,0,0)'
    },
    changelog: {
      codeForeground: 'white',
      codeBackground: 'rgba(255,255,255,0.1)'
    },
    status: {
      ...DarkTheme.status,
      success: 'rgb(145,189,57)',
      failed: 'rgb(213,70,91)',
      cardBackground: '#262628'
    },
    cards: {
      background: 'rgba(58, 58, 60, 1)',
      foreground: 'white',
      border: '#666668',
      tagBackground: '#6f6f71',
      tagLabelBackground: 'rgba(0, 0, 0, 0.14)',
      tagLabelForeground: 'rgba(255, 255, 255, 0.92)'
    },
    table: {
      ...DarkTheme.table,
      odd: '#3A3A3C',
      pills: '#5d5d5d',
      pillsSpecial: 'rgb(165 92 0)'
    },
    text: {
      primary: 'white',
      secondary: 'rgba(174, 174, 178, 1)'
    },
    button: {
      background: 'rgb(28,28,30)',
      border: 'rgba(255,255,255,0.3)',
      colorHover: 'white',
      color: 'rgba(210,210,210)',
      icon: 'rgba(255,255,255,0.3)'
    },
    buttonPrimary: {
      background: 'rgb(28,28,30)',
      border: 'rgb(255,100,0)',
      colorHover: 'white',
      color: 'rgba(210,210,210)',
      icon: 'rgba(255,255,255,0.3)'
    },
    forms: {
      ...DarkTheme.forms,
      checkbox: '#333',
      checkboxChecked: 'white',
      inputBackground: 'rgb(37 37 39)',
      inputForeground: 'white',
      inputBorder: '#434343',
      toggleOnColor: 'rgb(0,192,255)',
      toggleHandleColor: '#fff'
    },
    combobox: {
      ...DarkTheme.combobox,
      border: '#494949',
      backgroundSelected: 'rgba(28, 28, 30, 1)',
      background: 'rgba(44, 44, 46, 1)',
      headerBackground: 'rgba(58, 58, 60, 1)'
    },
    floating: {
      background: 'rgba(28, 28, 30, 0.8)',
      backgroundInactive: 'rgba(28, 28, 30, 0.5)',
      border: 'rgba(255,255,255,0.2)'
    }
  }
});
