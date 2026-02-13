import { theme } from '../reactor-theme-fragment';
import { Themes } from '../ThemeStore';

export const DarkTheme = theme.addThemeValues({
  name: Themes.REACTOR,
  values: {
    plan: {
      background: '#00945b',
      foreground: 'white',
      border: '#b90a73'
    },
    canvas: {
      background: '#1d222a',
      grid: '#212731'
    },
    workspace: {
      background: '#191d24',
      overlayBackground: 'rgba(33,39,49,0.4)',
      overlayBorder: 'rgba(0,0,0,0)',
      overlayBackgroundHover: 'rgba(33,39,49,0.8)',
      overlayBorderHover: '#ff6a1a',
      overlayDividerColor: '#ff6a1a',
      overlayDividerHover: '#ff6a1a'
    },
    dnd: {
      hintColor: 'red',
      hoverColor: 'red'
    },
    tooltips: {
      background: 'rgb(0,0,0)',
      foreground: '#fff'
    },
    panels: {
      iconBackground: '#252c37',
      trayBackground: '#15191f',
      background: '#1c2129',
      titleBackground: '#1f252e',
      divider: '#191d24',
      searchBackground: '#171c24',
      searchForeground: 'white',
      tabForeground: 'rgba(255,255,255,0.5)',
      tabForegroundSelected: 'white',
      tabBackgroundSelected: '#171b23',
      itemIconColorSelected: 'rgb(0,192,255)',
      titleForeground: '#fff',
      scrollBar: 'rgba(255,255,255,0.2)',
      trayButton: 'rgba(0,0,0,0.1)',
      trayButtonSelected: 'rgba(0,0,0,0.5)'
    },
    meta: {
      background: 'rgba(0,0,0,0.1)',
      foreground: '#fff'
    },
    icons: {
      dualIconBackground: 'rgba(0,0,0,0.8)',
      color: 'white'
    },
    trees: {
      labelColor: '#fff',
      selectedBackground: '#15191f'
    },
    guide: {
      accent: '#ff6a1a',
      tooltipBackground: 'hsl(21deg 58% 16%)',
      accentText: '#000',
      startButton: '#2f3a51',
      startButtonText: '#fff'
    },
    graphs: {
      grid: 'rgba(255,255,255,0.05)',
      line: 'rgb(132 158 255)',
      fillStop1: 'rgba(0, 118, 214, 0.4)',
      fillStop2: 'rgba(130,0,255,0.4)',
      fillStop3: 'rgba(154, 0, 187, 0.4)',
      thresholdLine: '#ff4800'
    },
    cards: {
      background: '#15191e',
      foreground: 'rgb(164,164,164)',
      border: '#2b3340'
    },
    status: {
      cardBackground: '#14181e',
      failed: '#862c00',
      failedForeground: 'black',
      loading: '#00b4ff',
      success: '#658600',
      successForeground: 'white'
    },
    header: {
      background: '#191d24',
      primary: '#ff6851',
      secondary: '#9370db',
      backgroundLogo: '#13171c',
      backgroundLogoHover: '#000000',
      foreground: '#fff'
    },
    changelog: {
      codeForeground: 'rgb(132,221,255)',
      codeBackground: 'rgb(4,33,40)'
    },
    footer: {
      background: '#191d24'
    },
    combobox: {
      textSelected: 'white',
      headerForeground: 'white',
      background: '#0f121a',
      backgroundSelected: 'rgb(50, 60, 75)',
      text: 'rgb(205,205,205)',
      headerBackground: '#131822',
      border: '#292f35',
      shadowColor: 'rgba(0, 0, 0, 0.5)'
    },
    tabs: {
      selectedAccentSingle: '#00c0ff',
      selectedAccent: '#00c0ff',
      selectedBackground: '#171b23'
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
    buttonPrimary: {
      background: '#0a0d14',
      border: 'rgb(0,192,255)',
      color: 'rgba(255,255,255,0.8)',
      colorHover: 'white',
      icon: 'rgb(0,192,255)'
    },
    text: {
      primary: 'rgba(255,255,255,0.8)',
      secondary: 'rgba(255,255,255,0.5)'
    },
    forms: {
      checkbox: '#323841',
      checkboxChecked: 'rgb(0,192,255)',
      inputForeground: 'white',
      inputBackground: '#15191f',
      inputBorder: '#343a46',
      toggleOnColor: 'rgb(0,192,255)',
      toggleHandleColor: 'white',
      groupBorder: 'rgba(255,255,255,0.1)',
      groupLabelForeground: '#fff',
      description: 'rgb(118 120 124)'
    },
    table: {
      text: 'rgba(255,255,255,0.7)',
      odd: '#1a1e24',
      pills: '#323841',
      pillsSpecial: 'rgb(0,79,110)',
      columnBackground: 'rgba(0, 0, 0, 0.3)',
      columnForeground: '#fff'
    },
    floating: {
      background: 'rgba(20,24,29,0.8)',
      backgroundInactive: 'rgba(25,30,37,0.45)'
    }
  }
});
