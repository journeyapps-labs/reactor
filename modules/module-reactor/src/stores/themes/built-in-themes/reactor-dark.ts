import { theme } from '../reactor-theme-fragment';
import { DarkTheme } from './reactor';
import { Themes } from '../ThemeStore';

theme.addThemeValues({
  name: Themes.REACTOR_DARK,
  values: {
    ...DarkTheme,
    canvas: {
      background: '#0c0c0c',
      grid: '#171717'
    },
    workspace: {
      ...DarkTheme.workspace,
      background: '#0b0b0b',
      overlayBackground: 'rgba(12,12,12,0.5)',
      overlayBackgroundHover: 'rgba(12,12,12,0.82)'
    },
    panels: {
      ...DarkTheme.panels,
      iconBackground: '#141414',
      trayBackground: '#0a0a0a',
      background: '#0f0f0f',
      titleBackground: '#171717',
      divider: '#2a2a2a',
      searchBackground: '#101010',
      searchForeground: '#cecece',
      tabForeground: 'rgba(206,206,206,0.72)',
      tabForegroundSelected: '#e0e0e0',
      tabBackgroundSelected: '#101010',
      titleForeground: '#e0e0e0',
      scrollBar: 'rgba(150,150,150,0.35)',
      trayButton: 'rgba(255,255,255,0.03)',
      trayButtonSelected: 'rgba(0,0,0,0.42)'
    },
    header: {
      ...DarkTheme.header,
      background: '#0d0d0d',
      backgroundLogo: '#090909',
      backgroundLogoHover: '#050505',
      primary: '#33b8de',
      secondary: '#79b7cf',
      foreground: '#dedede'
    },
    footer: {
      background: '#0d0d0d'
    },
    tabs: {
      selectedAccentSingle: '#33b8de',
      selectedAccent: '#33b8de',
      selectedBackground: '#101010'
    },
    trees: {
      ...DarkTheme.trees,
      labelColor: '#d0d0d0',
      selectedBackground: 'rgba(51, 184, 222, 0.16)'
    },
    text: {
      primary: 'rgba(214,214,214,0.9)',
      secondary: 'rgba(176,176,176,0.62)'
    },
    forms: {
      ...DarkTheme.forms,
      inputForeground: '#d2d2d2',
      inputBackground: '#0d0d0d',
      inputBorder: '#363636',
      checkboxChecked: '#33b8de',
      toggleOnColor: '#33b8de',
      groupBorder: 'rgba(148,148,148,0.2)',
      groupLabelForeground: '#d8d8d8',
      description: '#989898'
    },
    button: {
      background: '#0d0d0d',
      border: '#3a3a3a',
      color: 'rgba(208,208,208,0.84)',
      colorHover: '#e0e0e0',
      icon: 'rgba(176,176,176,0.52)'
    },
    buttonPrimary: {
      background: '#101010',
      border: '#33b8de',
      color: 'rgba(216,216,216,0.88)',
      colorHover: '#ececec',
      icon: '#33b8de'
    },
    cards: {
      background: '#121212',
      foreground: '#c7c7c7',
      border: '#333333',
      tagBackground: '#58595d',
      tagLabelBackground: 'rgba(0, 0, 0, 0.16)',
      tagLabelForeground: 'rgba(240, 240, 240, 0.92)'
    },
    status: {
      ...DarkTheme.status,
      cardBackground: '#141414',
      failed: '#7d3510',
      loading: '#2fa4c6',
      success: '#5f7e14'
    },
    table: {
      ...DarkTheme.table,
      text: 'rgba(194,194,194,0.84)',
      odd: '#131313',
      pills: '#343434',
      pillsSpecial: '#0a6f99',
      columnBackground: '#111111',
      columnForeground: '#d5d5d5'
    },
    combobox: {
      ...DarkTheme.combobox,
      textSelected: '#dddddd',
      headerForeground: '#d2d2d2',
      background: '#0f0f0f',
      backgroundSelected: '#232323',
      text: '#c6c6c6',
      headerBackground: '#171717',
      border: '#303030',
      shadowColor: 'rgba(0, 0, 0, 0.58)'
    },
    meta: {
      background: 'rgba(122,122,122,0.22)',
      foreground: 'rgba(208,208,208,0.84)'
    },
    floating: {
      background: 'rgba(12,12,12,0.84)',
      backgroundInactive: 'rgba(16,16,16,0.56)',
      border: 'rgba(148,148,148,0.3)'
    }
  }
});
