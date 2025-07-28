import { ComboBoxItem } from '../stores/combo/ComboBoxDirectives';
import { Btn } from '../definitions/common';
import { LayoutContext, LayoutContextSize } from '../layout';

export interface RepresentAsComboBoxItemsEvent {
  label?: string;
}

export interface RepresentAsControlOptions {
  context?: LayoutContext;
  size?: LayoutContextSize;
}

export interface AbstractControl {
  representAsBtn(): Btn;

  representAsControl(options?: RepresentAsControlOptions): React.JSX.Element;

  representAsComboBoxItems(options?: RepresentAsComboBoxItemsEvent): ComboBoxItem[];
}
