import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Validator } from '../actions/validators/ActionValidatorContext';
import { MousePosition } from '../layers/combo/SmartPositionWidget';
import { ReactorIcon } from '../widgets/icons/IconWidget';
import { TooltipProps } from '../widgets/info/tooltips';

export interface Panel {
  name: string;
  key: string;
  icon?: IconName;
}

export type ButtonActionLegacy = (event: MousePosition, loading?: (loading: boolean) => any) => any;
export type ButtonActionNew = (event: MousePosition) => Promise<any>;
export type ButtonAction = ButtonActionNew | ButtonActionLegacy;

export interface Btn extends TooltipProps {
  validator?: Validator;
  icon?: ReactorIcon;
  action?: ButtonAction;
  tooltip?: string;

  label?: string;
  forwardRef?: React.RefObject<HTMLDivElement>;
  highlight?: boolean;
  submitButton?: boolean;
  disabled?: boolean;
}

export interface User {
  name: string;
  email: string;
  online: boolean;
}
