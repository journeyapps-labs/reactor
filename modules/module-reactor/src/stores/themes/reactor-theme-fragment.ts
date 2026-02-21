import { ThemeFragment } from './ThemeFragment';

const ButtonTheme = {
  background: 'Background color',
  border: 'Border color',
  color: 'Text color',
  colorHover: 'Text color on hover',
  icon: 'Icon color'
};

export const theme = new ThemeFragment({
  structure: {
    plan: {
      label: 'Journey Plan',
      colors: {
        background: 'Background color',
        border: 'Border color for plan notifications',
        foreground: 'Text color'
      }
    },
    canvas: {
      label: 'Canvas',
      colors: {
        background: 'Canvas Background',
        grid: 'Grid lines'
      }
    },
    tooltips: {
      label: 'Tooltip colors',
      colors: {
        background: 'Default background color',
        foreground: 'Default foreground color'
      }
    },
    workspace: {
      label: 'Workspace management colors',
      colors: {
        background: 'Background',
        overlayBackground: 'Overlay background',
        overlayBackgroundHover: 'Overlay background hover',
        overlayBorder: 'Overlay border color',
        overlayBorderHover: 'Overlay border hover color',
        overlayDividerColor: 'Overlay divider color',
        overlayDividerHover: 'Overlay divider hover color'
      }
    },
    panels: {
      label: 'Panel theme',
      colors: {
        trayBackground: 'Tray Header Background',
        trayButton: 'Tray Button Background',
        trayButtonSelected: 'Tray Button Selected Background',
        background: 'Panel Background',
        titleBackground: 'Panel title background',
        titleForeground: 'Panel title color',
        iconBackground: 'Title bar icon color',
        divider: 'Divider color',
        searchBackground: 'Background color of panel search field',
        searchForeground: 'Text color of panel search field',
        tabForeground: 'Panel tab background color',
        tabForegroundSelected: 'Panel tab text color when selected',
        tabBackgroundSelected: 'Panel tab background color when selected',
        itemIconColorSelected: 'Panel icon color when selected',
        scrollBar: 'Scrollbar color'
      }
    },
    meta: {
      label: 'Metadata pills',
      colors: {
        background: 'Background',
        foreground: 'Text color'
      }
    },
    dnd: {
      label: 'Drag and drop',
      colors: {
        hintColor: 'Hint Color',
        hoverColor: 'Hover Color'
      }
    },
    icons: {
      label: 'Icons',
      colors: {
        dualIconBackground: 'When two icons are present, the background color for both icons',
        color: 'Main icon color'
      }
    },
    trees: {
      label: 'Tree structures',
      colors: {
        labelColor: 'Color of primary labels',
        selectedBackground: 'Background color of tree item when selected'
      }
    },
    guide: {
      label: 'Guide tours',
      colors: {
        accent: 'Main accent color',
        tooltipBackground: 'Background color for guide tooltips',
        accentText: 'Main accent text color',
        startButton: 'Start button background',
        startButtonText: 'Start button text color'
      }
    },
    graphs: {
      label: 'Graphs',
      colors: {
        grid: 'Grid color',
        line: 'Line color',
        fillStop1: 'Fill color gradient stop 1',
        fillStop2: 'Fill color gradient stop 2',
        fillStop3: 'Fill color gradient stop 3',
        thresholdLine: 'Threshold line color'
      }
    },
    tabs: {
      label: 'Tabs',
      colors: {
        selectedAccentSingle: '',
        selectedAccent: '',
        selectedBackground: ''
      }
    },
    status: {
      label: 'Status information',
      colors: {
        cardBackground: 'Status card background',
        success: 'Success color',
        failed: 'Failed color',
        failedForeground: 'Failed text color',
        loading: 'Loading color',
        successForeground: 'Success text color'
      }
    },
    cards: {
      label: 'Cards',
      colors: {
        background: 'Background color',
        foreground: 'Text color',
        border: 'Border color',
        tagBackground: 'Tag pill background color',
        tagLabelBackground: 'Tag label background color',
        tagLabelForeground: 'Tag label text color'
      }
    },
    combobox: {
      label: 'Combo Box',
      colors: {
        background: 'Background color',
        backgroundSelected: 'Background color of selected item',
        textSelected: 'Text color of selected item',
        text: 'Text color',
        border: 'Border color',
        headerBackground: 'Background color of header',
        headerForeground: 'Text color of header',
        shadowColor: 'Color of the shadow for the container'
      }
    },
    forms: {
      label: 'Forms',
      colors: {
        description: 'Description for various inputs',
        inputBackground: 'Background color for input fields',
        inputForeground: 'Text color for input fields',
        inputBorder: 'Border color for input fields',
        checkbox: 'Checkbox color',
        checkboxChecked: 'Checkbox color when selected',
        toggleOnColor: 'Selected color for toggle fields',
        toggleHandleColor: 'Handle color for toggle fields',
        groupBorder: 'Border of groups in collection inputs',
        groupLabelForeground: 'Label color of collection input entries'
      }
    },
    footer: {
      label: 'Footer',
      colors: {
        background: 'Background color'
      }
    },
    header: {
      label: 'Header',
      colors: {
        background: 'Background color',
        backgroundLogo: 'Background color of logo',
        backgroundLogoHover: 'Background color of log when selected',
        primary: 'Primary color',
        secondary: 'Secondary color',
        foreground: 'Text color'
      }
    },
    visor: {
      label: 'Visor',
      colors: {
        background: 'Background color'
      }
    },
    text: {
      label: 'Text',
      colors: {
        primary: 'Primary color',
        secondary: 'Secondary color'
      }
    },
    buttonLink: {
      label: 'Link button',
      colors: ButtonTheme
    },
    button: {
      label: 'Normal button',
      colors: ButtonTheme
    },
    buttonPrimary: {
      label: 'Primary button',
      colors: ButtonTheme
    },
    changelog: {
      label: 'Changelog',
      colors: {
        codeBackground: '',
        codeForeground: ''
      }
    },
    table: {
      label: 'Table data',
      colors: {
        odd: 'Background color of odd rows',
        pills: 'Background color of pills inside tables',
        text: 'Text color',
        pillsSpecial: 'Accent color for pills',
        columnBackground: 'Background color for columns',
        columnForeground: 'Text color for columns'
      }
    },
    floating: {
      label: 'Floating panels',
      colors: {
        background: 'Background color',
        backgroundInactive: 'Background color when inactive',
        border: 'Border color'
      }
    }
  }
});

export const styled = theme.styled();
export const themed = theme.styled();
