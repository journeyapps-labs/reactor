import { ThemeFragment } from '@journeyapps-labs/reactor-mod';
import { Themes } from '@journeyapps-labs/reactor-mod';

export const theme = new ThemeFragment({
  structure: {
    editor: {
      label: 'Code editor',
      colors: {
        background: 'Editor background color',
        backgroundSticky: 'Sticky editor layer background color'
      }
    }
  }
});

theme.addThemeValues({
  name: Themes.REACTOR,
  values: {
    editor: {
      background: '#1d222a',
      backgroundSticky: '#1d222a'
    }
  }
});
theme.addThemeValues({
  name: Themes.HEXAGON,
  values: {
    editor: {
      background: 'rgb(22,22,23)',
      backgroundSticky: 'rgb(22,22,23)'
    }
  }
});
theme.addThemeValues({
  name: Themes.JOURNEY,
  values: {
    editor: {
      background: 'rgb(38, 50, 56)',
      backgroundSticky: 'rgb(38, 50, 56)'
    }
  }
});
theme.addThemeValues({
  name: Themes.REACTOR_LIGHT,
  values: {
    editor: {
      background: '#cccccc',
      backgroundSticky: '#cccccc'
    }
  }
});
export const Scarlet = theme.addThemeValues({
  name: Themes.SCARLET,
  values: {
    editor: {
      background: '#1d222a',
      backgroundSticky: '#1d222a'
    }
  }
});
theme.addThemeValues({
  name: Themes.OXIDE,
  values: {
    editor: {
      background: 'rgb(32,32,33)',
      backgroundSticky: 'rgb(32,32,33)'
    }
  }
});
theme.addThemeValues({
  name: Themes.BUNNY,
  values: {
    editor: {
      background: '#161322',
      backgroundSticky: '#161322'
    }
  }
});

export const styled = theme.styled();
export const themed = theme.styled();
