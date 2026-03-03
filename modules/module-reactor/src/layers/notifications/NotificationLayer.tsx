import * as React from 'react';
import { inject } from '../../inversify.config';
import { LayerDirective } from '../../stores/layer/LayerDirective';
import { NotificationStore } from '../../stores/NotificationStore';
import { NotificationsLayerWidget } from '../../widgets/notifications/NotificationsLayerWidget';

export class NotificationLayer extends LayerDirective {
  @inject(NotificationStore)
  accessor notificationStore: NotificationStore;

  getLayerContent(): React.JSX.Element {
    return <NotificationsLayerWidget />;
  }

  show(): boolean {
    return this.notificationStore.notifications.length > 0;
  }

  transparent(): boolean {
    return true;
  }

  alwaysOnTop(): boolean {
    return true;
  }

  layerWillHide(): boolean {
    // Notifications should be controlled by NotificationStore lifecycle (timeout/delete),
    // not by layer dismissal events (escape/backdrop).
    return false;
  }
}
