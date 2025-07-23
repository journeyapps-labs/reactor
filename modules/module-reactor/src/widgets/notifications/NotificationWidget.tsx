import * as React from 'react';
import { Notification, NotificationType } from '../../stores/NotificationStore';
import { keyframes } from '@emotion/react';
import { inject } from '../../inversify.config';
import { FloatingPanelButtonWidget } from '../floating/FloatingPanelButtonWidget';
import { FormErrorDisplayWidget } from '../forms/FormErrorDisplayWidget';
import { ThemeStore } from '../../stores/themes/ThemeStore';
import { styled, theme } from '../../stores/themes/reactor-theme-fragment';
import { IconWidget } from '../icons/IconWidget';

export interface NotificationWidgetProps {
  notification: Notification;
  className?;
  action: () => any;
}

namespace S {
  const Animation = keyframes`
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  `;

  export const Container = styled.div<{ color: string }>`
    padding: 10px;
    background: ${(p) => p.theme.combobox.background};
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    color: ${(p) => p.theme.combobox.text};
    border: solid 1px ${(p) => p.color};
    border-radius: 3px;
    overflow: hidden;
    pointer-events: all;
    cursor: pointer;
    animation: ${Animation} 0.5s ease-out;
    max-width: 400px;
  `;

  export const Title = styled.div`
    font-size: 16px;
  `;

  export const Description = styled.div`
    font-size: 13px;
    padding-top: 5px;
    opacity: 0.6;
  `;

  export const Buttons = styled.div`
    display: flex;
    align-items: center;
    padding-top: 8px;
    justify-content: flex-end;
  `;

  export const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  export const Close = styled(IconWidget)``;

  export const Button = styled(FloatingPanelButtonWidget)`
    margin-right: 2px;
  `;
}

export class NotificationWidget extends React.Component<NotificationWidgetProps> {
  @inject(ThemeStore)
  accessor themeStore: ThemeStore;

  getColor() {
    if (this.props.notification.type === NotificationType.ERROR) {
      return this.themeStore.getCurrentTheme(theme).status.failed;
    }
    if (this.props.notification.type === NotificationType.SPECIAL) {
      return 'mediumpurple';
    }
    if (this.props.notification.type === NotificationType.INSERT_COIN) {
      return this.themeStore.getCurrentTheme(theme).plan.border;
    }
    if (this.props.notification.type === NotificationType.SUCCESS) {
      return this.themeStore.getCurrentTheme(theme).status.success;
    }
    return this.themeStore.getCurrentTheme(theme).combobox.border;
  }

  getButtons() {
    if (this.props.notification.btns?.length > 0) {
      return (
        <S.Buttons>
          {this.props.notification.btns.map((btn) => {
            return <S.Button btn={btn} key={btn.label} />;
          })}
        </S.Buttons>
      );
    }
  }

  render() {
    const { validationResult } = this.props.notification;
    return (
      <S.Container
        color={this.getColor()}
        onClick={() => {
          this.props.action();
        }}
        className={this.props.className}
      >
        <S.Top>
          <S.Title>{this.props.notification.title}</S.Title>
          <S.Close icon="times" />
        </S.Top>
        <S.Description>
          {this.props.notification.description?.split('\n').map((line, index) => {
            return <p key={`line_${index}`}>{line}</p>;
          })}
          {validationResult ? (
            <FormErrorDisplayWidget errors={validationResult.errors} warnings={validationResult.warnings} />
          ) : null}
        </S.Description>
        {this.getButtons()}
      </S.Container>
    );
  }
}
