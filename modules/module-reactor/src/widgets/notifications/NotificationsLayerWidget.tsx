import * as React from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import { NotificationStore } from '../../stores/NotificationStore';
import { inject } from '../../inversify.config';
import { NotificationWidget } from './NotificationWidget';

namespace S {
  export const Container = styled.div`
    position: fixed;
    z-index: 2;
    top: 50px;
    right: 50px;
    pointer-events: none;
  `;

  export const Notification = styled(NotificationWidget)`
    margin-bottom: 2px;
  `;
}

@observer
export class NotificationsLayerWidget extends React.Component {
  @inject(NotificationStore)
  accessor notificationStore: NotificationStore;

  render() {
    return (
      <S.Container>
        {this.notificationStore.notifications.map((notification) => {
          return (
            <S.Notification
              action={() => {
                notification.delete();
              }}
              key={notification.id}
              notification={notification.notification}
            />
          );
        })}
      </S.Container>
    );
  }
}
