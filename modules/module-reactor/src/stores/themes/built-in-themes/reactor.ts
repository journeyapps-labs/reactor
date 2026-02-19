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
      background: '#1a2028',
      grid: '#232a34'
    },
    workspace: {
      background: '#181f27',
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
      iconBackground: '#242d39',
      trayBackground: '#131821',
      background: '#1b212b',
      titleBackground: '#212a36',
      divider: '#324053',
      searchBackground: '#161d28',
      searchForeground: 'white',
      tabForeground: 'rgba(255,255,255,0.62)',
      tabForegroundSelected: 'white',
      tabBackgroundSelected: '#141b24',
      itemIconColorSelected: 'rgb(0,192,255)',
      titleForeground: '#fff',
      scrollBar: 'rgba(184,204,231,0.4)',
      trayButton: 'rgba(255,255,255,0.04)',
      trayButtonSelected: 'rgba(0,0,0,0.45)'
    },
    meta: {
      background: 'rgba(133,156,186,0.2)',
      foreground: 'rgba(224,235,250,0.9)'
    },
    icons: {
      dualIconBackground: 'rgba(0,0,0,0.8)',
      color: 'white'
    },
    trees: {
      labelColor: '#eef5ff',
      selectedBackground: 'rgba(0, 192, 255, 0.14)'
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
      background: '#151c27',
      foreground: '#c6d2e1',
      border: '#3b4a5f',
      tagBackground: '#5b6a80',
      tagLabelBackground: 'rgba(0, 0, 0, 0.12)',
      tagLabelForeground: 'rgba(236, 244, 255, 0.92)'
    },
    status: {
      cardBackground: '#172130',
      failed: '#862c00',
      failedForeground: 'black',
      loading: '#00b4ff',
      success: '#658600',
      successForeground: 'white'
    },
    header: {
      background: '#161d26',
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
      background: '#161d26'
    },
    combobox: {
      textSelected: 'white',
      headerForeground: 'white',
      background: '#0f141d',
      backgroundSelected: 'rgb(56, 69, 87)',
      text: 'rgb(214,222,235)',
      headerBackground: '#151d29',
      border: '#2f3d4f',
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
      background: '#0d121b',
      border: '#3f4e64',
      color: 'rgba(255,255,255,0.8)',
      colorHover: 'white',
      icon: 'rgba(205,220,241,0.45)'
    },
    buttonLink: {
      background: 'transparent',
      border: 'transparent',
      color: 'rgba(255,255,255,0.8)',
      colorHover: 'rgb(255,255,255)',
      icon: 'rgba(255, 255, 255 ,0.3)'
    },
    buttonPrimary: {
      background: '#101725',
      border: 'rgb(0,192,255)',
      color: 'rgba(255,255,255,0.8)',
      colorHover: 'white',
      icon: 'rgb(0,192,255)'
    },
    text: {
      primary: 'rgba(236,244,255,0.88)',
      secondary: 'rgba(199,214,236,0.76)'
    },
    forms: {
      checkbox: '#323841',
      checkboxChecked: 'rgb(0,192,255)',
      inputForeground: 'white',
      inputBackground: '#131a24',
      inputBorder: '#44556d',
      toggleOnColor: 'rgb(0,192,255)',
      toggleHandleColor: 'white',
      groupBorder: 'rgba(184,204,231,0.22)',
      groupLabelForeground: '#fff',
      description: '#97a8bf'
    },
    table: {
      text: 'rgba(218,231,248,0.84)',
      odd: '#1b2430',
      pills: '#3f4d61',
      pillsSpecial: '#006a94',
      columnBackground: '#15202d',
      columnForeground: '#ecf4ff'
    },
    floating: {
      background: 'rgba(20,24,29,0.8)',
      backgroundInactive: 'rgba(25,30,37,0.45)'
    }
  }
});
