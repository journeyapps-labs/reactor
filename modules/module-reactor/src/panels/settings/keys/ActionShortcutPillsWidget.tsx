import * as React from 'react';
import { observer } from 'mobx-react';
import { ioc } from '../../../inversify.config';
import { ActionShortcutHandler } from '../../../actions/shortcuts/ActionShortcutHandler';
import * as _ from 'lodash';
import { KeyboardShortcutPillsWidget } from './KeyboardShortcutPillsWidget';
import { ShortcutStore } from '../../../stores/shortcuts/ShortcutStore';
import { ACTION_SHORTCUT_HANDLER } from '../../../actions/shortcuts/action-shortcut-common';
import { Action } from '../../../actions/Action';

export interface ActionShortcutPillsWidgetProps {
  action: Action;
  className?: any;
}

export const ActionShortcutPillsWidget: React.FC<ActionShortcutPillsWidgetProps> = observer((props) => {
  const actionShortcutHandler = ioc.get(ShortcutStore).getHandler<ActionShortcutHandler>(ACTION_SHORTCUT_HANDLER);
  const shortcut = _.first(actionShortcutHandler.getShortcutsForReactorAction(props.action));
  if (!shortcut) {
    return null;
  }
  return <KeyboardShortcutPillsWidget className={props.className} chord={shortcut.chord} />;
});
