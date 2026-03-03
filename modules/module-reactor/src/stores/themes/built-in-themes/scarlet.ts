import { theme } from '../reactor-theme-fragment';
import { DarkTheme } from './reactor';
import { Themes } from '../ThemeStore';

export const Scarlet = theme.addThemeValues({
  name: Themes.SCARLET,
  values: {
    ...DarkTheme,
    canvas: {
      background: 'rgb(17,18,23)',
      grid: 'rgb(24,26,33)'
    },
    panels: {
      ...DarkTheme.panels,
      iconBackground: 'rgb(27,29,36)',
      trayBackground: 'rgb(14,15,19)',
      background: 'rgb(22,24,29)',
      titleBackground: 'rgb(17,18,23)',
      divider: 'rgb(23,24,31)',
      searchBackground: '#1d2027',
      searchForeground: 'white',
      tabForeground: 'rgba(255,255,255,0.5)',
      tabForegroundSelected: 'white',
      tabBackgroundSelected: '#171b23',
      itemIconColorSelected: 'rgb(0,192,255)'
    },
    dnd: {
      hintColor: 'rgb(78,105,0)',
      hoverColor: 'rgb(192,255,0)'
    },
    guide: {
      accent: '#ff4aa6',
      tooltipBackground: 'hsl(21deg 58% 16%)',
      accentText: '#000',
      startButton: 'linear-gradient(131deg, rgba(255,143,0,1) 0%, rgba(255,23,68,1) 100%)',
      startButtonText: '#ffffff'
    },
    cards: {
      background: '#191e25',
      foreground: 'rgb(205,205,205)',
      border: '#2f3744',
      tagBackground: '#67515a',
      tagLabelBackground: 'rgba(0, 0, 0, 0.14)',
      tagLabelForeground: 'rgba(244, 232, 238, 0.92)'
    },
    status: {
      cardBackground: '#14181e',
      failed: '#c40f50',
      failedForeground: '#fff',
      loading: '#0084b4',
      success: '#6ebe00',
      successForeground: 'black'
    },
    header: {
      ...DarkTheme.header,
      background: 'rgb(17,18,23)',
      primary: '#ff0059',
      secondary: '#9370db',
      backgroundLogo: '#000000',
      backgroundLogoHover: '#2f1a1a'
    },
    changelog: {
      codeForeground: 'rgb(132,221,255)',
      codeBackground: 'rgb(4,33,40)'
    },
    footer: {
      background: 'rgb(17,18,23)'
    },
    combobox: {
      textSelected: 'white',
      headerForeground: 'white',
      background: '#1d222a',
      backgroundSelected: '#721734',
      text: 'rgb(205,205,205)',
      border: '#3a4454',
      headerBackground: '#101217',
      shadowColor: 'rgba(0, 0, 0, 0.5)'
    },
    tabs: {
      selectedAccentSingle: '#ff0059',
      selectedAccent: '#ff0059',
      selectedBackground: '#2d1e21'
    },
    visor: {
      background: 'rgba(0, 0, 0, 0.2)'
    },
    button: {
      background: '#0a0d14',
      border: 'rgb(50,50,50)',
      color: 'rgba(255,255,255,0.8)',
      colorHover: 'white',
      icon: 'rgba(255,255, 255,0.3)'
    },
    buttonLink: {
      background: 'transparent',
      border: 'transparent',
      color: 'rgba(255,255,255,0.8)',
      colorHover: 'rgb(255,255,255)',
      icon: 'rgba(255, 255, 255 ,0.3)'
    },
    trees: {
      ...DarkTheme.trees,
      selectedBackground: 'rgba(255, 74, 166, 0.18)'
    },
    buttonPrimary: {
      background: '#0a0d14',
      border: 'rgb(255,0,102)',
      color: 'rgba(255,255,255,0.8)',
      colorHover: 'white',
      icon: '#ff4aa6'
    },
    text: {
      primary: 'rgba(255,255,255,0.8)',
      secondary: 'rgba(255,255,255,0.38)'
    },
    forms: {
      ...DarkTheme.forms,
      checkbox: '#393c40',
      checkboxChecked: '#9370db',
      inputForeground: 'white',
      inputBackground: '#15191f',
      toggleOnColor: '#9370db',
      toggleHandleColor: '#fff'
    },
    table: {
      text: 'rgba(255,255,255,0.7)',
      odd: '#1a1e24',
      pills: '#323841',
      pillsSpecial: '#54001f',
      columnBackground: 'rgba(0, 0, 0, 0.3)',
      columnForeground: '#eaeaea'
    },
    floating: {
      background: 'rgba(20,24,29,0.8)',
      backgroundInactive: 'rgba(25,30,37,0.45)',
      border: 'rgba(255, 74, 166, 0.28)'
    }
  }
});
