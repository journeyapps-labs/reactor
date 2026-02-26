import * as React from 'react';
import { observer } from 'mobx-react';
import {
  CardWidget,
  ComboBoxItem,
  ComboBoxStore2,
  DialogStore,
  DialogStore2,
  FormDialogDirective,
  NotificationStore,
  NotificationType,
  PanelButtonMode,
  PanelButtonWidget,
  ReactorPanelModel,
  SimpleComboBoxDirective,
  System,
  ioc,
  styled
} from '@journeyapps-labs/reactor-mod';
import { TodoEntities, TodoModel, TodoStore } from '@journeyapps-labs/reactor-mod-todos';
import { DemoFormModel } from '../forms/DemoFormModel';

export interface PlaygroundDialogsComboboxesPanelWidgetProps {
  model: ReactorPanelModel;
}

const TOP_LEVEL_ITEMS: ComboBoxItem[] = [
  {
    key: 'coffee',
    title: 'Coffee',
    group: 'Drinks',
    right: <span style={{ fontSize: 11, opacity: 0.6 }}>42</span>,
    children: [
      {
        key: 'coffee-hot',
        title: 'Hot',
        group: 'Temperature',
        children: [
          { key: 'coffee-hot-americano', title: 'Americano', group: 'Espresso bar' },
          { key: 'coffee-hot-flat-white', title: 'Flat White', group: 'Espresso bar' },
          { key: 'coffee-hot-cappuccino', title: 'Cappuccino', group: 'Espresso bar' }
        ]
      },
      {
        key: 'coffee-iced',
        title: 'Iced',
        group: 'Temperature',
        children: [
          { key: 'coffee-iced-latte', title: 'Iced Latte', group: 'Cold espresso' },
          { key: 'coffee-iced-mocha', title: 'Iced Mocha', group: 'Cold espresso' },
          { key: 'coffee-iced-cold-brew', title: 'Cold brew', group: 'Cold espresso' }
        ]
      },
      { key: 'coffee-drip', title: 'Filter / Drip', group: 'Brew method' },
      { key: 'coffee-espresso-shot', title: 'Espresso shot', group: 'Brew method' }
    ]
  },
  {
    key: 'tea',
    title: 'Tea',
    group: 'Drinks',
    right: <span style={{ fontSize: 11, opacity: 0.6 }}>33</span>,
    children: [
      { key: 'tea-green', title: 'Green', group: 'Tea family' },
      { key: 'tea-black', title: 'Black', group: 'Tea family' },
      { key: 'tea-herbal', title: 'Herbal', group: 'Tea family' }
    ]
  },
  {
    key: 'pastry',
    title: 'Pastry',
    group: 'Food',
    right: <span style={{ fontSize: 11, opacity: 0.6 }}>12</span>
  },
  {
    key: 'retail-mug',
    title: 'House mug',
    group: 'Retail',
    right: <span style={{ fontSize: 11, opacity: 0.6 }}>leaf</span>
  }
];

export const PlaygroundDialogsComboboxesPanelWidget: React.FC<PlaygroundDialogsComboboxesPanelWidgetProps> = observer(
  () => {
    const dialogStore = ioc.get(DialogStore);
    const dialogStore2 = ioc.get(DialogStore2);
    const comboBoxStore2 = ioc.get(ComboBoxStore2);
    const notificationStore = ioc.get(NotificationStore);

    const runMessageDialog = async () => {
      await dialogStore.showMessageDialog({
        title: 'Message dialog',
        message: 'This is a basic message dialog from the legacy dialog store.'
      });
    };

    const runConfirmDialog = async () => {
      const confirmed = await dialogStore.showConfirmDialog({
        title: 'Confirm dialog',
        message: 'Do you want to keep testing dialog flows?'
      });

      await dialogStore.showMessageDialog({
        title: 'Confirm result',
        message: confirmed ? 'Confirmed' : 'Canceled'
      });
    };

    const runInputDialog = async () => {
      const value = await dialogStore.showInputDialog({
        title: 'Input dialog',
        message: 'Provide a value to test input dialog behavior',
        initialValue: 'example-value'
      });

      await dialogStore.showMessageDialog({
        title: 'Input result',
        message: value == null ? 'No value entered' : `Input: ${value}`
      });
    };

    const runFormDialog = async () => {
      const directive = new FormDialogDirective({
        title: 'Demo form dialog',
        form: new DemoFormModel(),
        handler: async (form) => {
          console.log('Demo form submitted', form.value());
        }
      });

      await dialogStore2.showDialog(directive);
    };

    const runNestedComboDemo = async (position: any) => {
      await comboBoxStore2.show(
        new SimpleComboBoxDirective({
          title: 'Nested combobox demo',
          subtitle: 'Pick a leaf node',
          event: position,
          items: TOP_LEVEL_ITEMS
        })
      );
    };

    const runEntityContextComboDemo = async (position: any) => {
      const todoStore = ioc.get<TodoStore>(TodoStore);
      const entity = todoStore.activeTodo || todoStore.todos[0];
      if (!entity) {
        await dialogStore.showMessageDialog({
          title: 'No todo items',
          message: 'Create at least one todo item first.'
        });
        return;
      }

      const definition = ioc.get(System).getDefinition<TodoModel>(TodoEntities.TODO_ITEM);
      definition.showContextMenuForEntity(entity, position);
    };

    const showInfoNotification = () => {
      notificationStore.showNotification({
        type: NotificationType.INFO,
        title: 'Info notification',
        description: 'This is a standard info notification from NotificationStore.'
      });
    };

    const showSuccessNotification = () => {
      notificationStore.showNotification({
        type: NotificationType.SUCCESS,
        title: 'Success notification',
        description: 'The action completed successfully.'
      });
    };

    const showErrorNotification = () => {
      notificationStore.showNotification({
        type: NotificationType.ERROR,
        title: 'Error notification',
        description: 'Something went wrong while processing the action.'
      });
    };

    const showValidationNotification = () => {
      notificationStore.showNotification({
        type: NotificationType.VALIDATION,
        title: 'Validation notification',
        description: 'Validation produced warnings and errors.',
        validationResult: {
          errors: ['Todo title is required', 'Owner must be selected'],
          warnings: ['Description is shorter than recommended minimum']
        }
      });
    };

    return (
      <S.Container>
        <CardWidget
          title="Dialogs"
          subHeading="Legacy + directive dialog test flows"
          sections={[
            {
              key: 'dialog-actions',
              content: () => {
                return (
                  <S.Buttons>
                    <PanelButtonWidget label="Message" icon="comment" action={runMessageDialog} />
                    <PanelButtonWidget label="Confirm" icon="question-circle" action={runConfirmDialog} />
                    <PanelButtonWidget label="Input" icon="keyboard" action={runInputDialog} />
                    <PanelButtonWidget
                      label="Form dialog"
                      icon="list"
                      action={runFormDialog}
                      mode={PanelButtonMode.PRIMARY}
                    />
                  </S.Buttons>
                );
              }
            }
          ]}
        />

        <CardWidget
          title="Comboboxes"
          subHeading="Nested side-by-side combobox demos"
          sections={[
            {
              key: 'combo-actions',
              content: () => {
                return (
                  <S.Buttons>
                    <PanelButtonWidget
                      label="Open nested combobox"
                      icon="sitemap"
                      action={runNestedComboDemo}
                      mode={PanelButtonMode.PRIMARY}
                    />
                    <PanelButtonWidget
                      label="Open entity context menu"
                      icon="cube"
                      action={runEntityContextComboDemo}
                    />
                  </S.Buttons>
                );
              }
            }
          ]}
        />

        <CardWidget
          title="Notifications"
          subHeading="NotificationStore demo for info, success, error and validation"
          sections={[
            {
              key: 'notification-actions',
              content: () => {
                return (
                  <S.Buttons>
                    <PanelButtonWidget label="Info" icon="info-circle" action={showInfoNotification} />
                    <PanelButtonWidget label="Success" icon="check" action={showSuccessNotification} />
                    <PanelButtonWidget label="Error" icon="warning" action={showErrorNotification} />
                    <PanelButtonWidget
                      label="Validation"
                      icon="list-alt"
                      action={showValidationNotification}
                      mode={PanelButtonMode.PRIMARY}
                    />
                  </S.Buttons>
                );
              }
            }
          ]}
        />
      </S.Container>
    );
  }
);

namespace S {
  export const Container = styled.div`
    padding: 12px;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    min-height: 100%;
    box-sizing: border-box;
  `;

  export const Buttons = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `;
}
