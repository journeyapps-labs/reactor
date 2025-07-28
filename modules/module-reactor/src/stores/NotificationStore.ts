import { observable, toJS } from 'mobx';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import { Btn } from '../definitions/common';

export enum NotificationType {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  SPECIAL = 'special',
  INSERT_COIN = 'insert-coin',
  VALIDATION = 'validation'
}

export interface NotificationValidationResult {
  errors: string[];
  warnings: string[];
}

export interface Notification {
  title: string;
  description: string;
  timeoutMs?: number;
  type?: NotificationType;
  btns?: Btn[];
  validationResult?: NotificationValidationResult;
}

export interface NotificationDirective {
  id: string;
  notification: Notification;
  reset: () => any;
  delete: () => any;
  _handle: any;
}

export class NotificationStore {
  @observable
  accessor notifications: NotificationDirective[];

  constructor() {
    this.notifications = [];
  }

  hasNotification(notification: Notification): NotificationDirective | null {
    for (let existingNotification of this.notifications) {
      if (_.isEqual(toJS(existingNotification.notification), notification)) {
        return existingNotification;
      }
    }
    return null;
  }

  normalizeNotification(notification: Notification): Notification {
    return {
      ...notification,
      timeoutMs: notification.timeoutMs == null ? 5000 : notification.timeoutMs,
      type: notification.type || NotificationType.INFO
    };
  }

  showNotificationWithDuplicateCheck(notification: Notification): NotificationDirective {
    const existingNotification = this.hasNotification(this.normalizeNotification(notification));
    if (existingNotification) {
      // reset the timer
      existingNotification.reset();

      return existingNotification;
    }
    return this.showNotification(notification);
  }

  showNotification(payload: Notification): NotificationDirective {
    const notification = this.normalizeNotification(payload);

    const directive: NotificationDirective = {
      id: uuid.v4(),
      notification: notification,
      _handle: null,
      delete: () => {
        const index = _.findIndex(this.notifications, { id: directive.id });

        // user may have already deleted the notification
        if (index !== -1) {
          this.notifications.splice(index, 1);
        }
      },
      reset: () => {
        setupTimeout();
      }
    };
    const setupTimeout = () => {
      if (directive.notification.timeoutMs === 0) {
        return;
      }
      if (directive._handle) {
        clearTimeout(directive._handle);
      }
      directive._handle = setTimeout(() => {
        directive.delete();
      }, notification.timeoutMs);
    };
    setupTimeout();

    this.notifications.push(directive);
    return directive;
  }
}
