import { GuideStep } from '../steps/GuideStep';
import { ComponentSelection } from './ComponentSelection';
import { DialogComponentSelection } from './DialogComponentSelection';
import { ComboBoxComponentSelection } from './ComboBoxComponentSelection';

export enum ReactorComponentType {
  BTN = 'button',
  HEADER_BUTTON = 'header-btn',
  FOOTER_BUTTON = 'footer-btn',
  PANEL_MICRO_BUTTON = 'panel-micro-button',
  COMBO_BOX_ITEM = 'combo-box-item',
  COMBO_BOX = 'combo-box',
  TREE_LEAF = 'tree-leaf',
  TAB = 'tab',
  PANEL = 'panel',
  DIALOG = 'dialog',
  CHECKBOX = 'checkbox'
}

export interface PanelComponentSelection {
  panel?: string;
}

export interface ButtonComponentSelection {
  label: string;
}

export type ComponentSelectorGenerator = (step: GuideStep) => any;

export interface ReactorComponentSelections {
  btn: (identifier: PanelComponentSelection & ButtonComponentSelection) => ComponentSelection;
  headerBtn: (identifier: ButtonComponentSelection) => ComponentSelection;
  footerBtn: (identifier: ButtonComponentSelection) => ComponentSelection;
  treeLeaf: (identifier: PanelComponentSelection & ButtonComponentSelection) => ComponentSelection;
  tab: (identifier: PanelComponentSelection & ButtonComponentSelection) => ComponentSelection;
  panel: (identifier: PanelComponentSelection & ButtonComponentSelection) => ComponentSelection;
  panelMicroBtn: (identifier: PanelComponentSelection & ButtonComponentSelection) => ComponentSelection;
  dialog: () => DialogComponentSelection;
  comboBoxItem: (name) => ComboBoxComponentSelection;
  comboBox: () => ComponentSelection;
  checkbox: (identifier: ButtonComponentSelection) => ComponentSelection;
}

export const generateReactorComponentSelections: ComponentSelectorGenerator = (step: GuideStep) => {
  return {
    btn: (identifier: PanelComponentSelection & ButtonComponentSelection) => {
      return step.register(
        new ComponentSelection({
          type: ReactorComponentType.BTN,
          identifier
        })
      );
    },
    headerBtn: (identifier: ButtonComponentSelection) => {
      return step.register(
        new ComponentSelection({
          type: ReactorComponentType.HEADER_BUTTON,
          identifier
        })
      );
    },
    footerBtn: (identifier: ButtonComponentSelection) => {
      return step.register(
        new ComponentSelection({
          type: ReactorComponentType.FOOTER_BUTTON,
          identifier
        })
      );
    },
    treeLeaf: (identifier: PanelComponentSelection & ButtonComponentSelection) => {
      return step.register(
        new ComponentSelection({
          type: ReactorComponentType.TREE_LEAF,
          identifier
        })
      );
    },
    tab: (identifier: PanelComponentSelection & ButtonComponentSelection) => {
      return step.register(
        new ComponentSelection({
          type: ReactorComponentType.TAB,
          identifier
        })
      );
    },
    panel: (identifier: PanelComponentSelection & ButtonComponentSelection) => {
      return step.register(
        new ComponentSelection({
          type: ReactorComponentType.PANEL,
          identifier
        })
      );
    },
    panelMicroBtn: (identifier: PanelComponentSelection & ButtonComponentSelection) => {
      return step.register(
        new ComponentSelection({
          type: ReactorComponentType.PANEL_MICRO_BUTTON,
          identifier
        })
      );
    },
    dialog: () => {
      return step.register(new DialogComponentSelection());
    },
    comboBoxItem: (label) => {
      return step.register(new ComboBoxComponentSelection(label));
    },
    checkbox: (identifier: ButtonComponentSelection) => {
      return step.register(
        new ComponentSelection({
          type: ReactorComponentType.CHECKBOX,
          identifier
        })
      );
    },
    comboBox: () => {
      return step.register(
        new ComponentSelection({
          type: ReactorComponentType.COMBO_BOX
        })
      );
    }
  } as ReactorComponentSelections;
};
