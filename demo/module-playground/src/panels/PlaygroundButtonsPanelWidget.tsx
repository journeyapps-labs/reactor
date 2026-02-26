import * as React from 'react';
import { observer } from 'mobx-react';
import {
  ActionStore,
  CardWidget,
  PassiveActionValidationState,
  PanelButtonMode,
  PanelButtonWidget,
  ReactorPanelModel,
  ioc,
  styled
} from '@journeyapps-labs/reactor-mod';
import { AddTodoNoteAction, CreateTodoAction, SetCurrentTodoItemAction } from '@journeyapps-labs/reactor-mod-todos';

export interface PlaygroundButtonsPanelWidgetProps {
  model: ReactorPanelModel;
}

export const PlaygroundButtonsPanelWidget: React.FC<PlaygroundButtonsPanelWidgetProps> = observer(() => {
  const [counter, setCounter] = React.useState(0);
  const actionStore = ioc.get(ActionStore);

  const increment = () => {
    setCounter((c) => c + 1);
  };

  const decrement = () => {
    setCounter((c) => c - 1);
  };

  const reset = () => {
    setCounter(0);
  };

  const openReactDocs = () => {
    window.open('https://react.dev/reference/react/useState', '_blank');
  };

  const disabledByValidator = {
    validate: () => ({
      type: PassiveActionValidationState.DISABLED
    })
  };

  return (
    <S.Container>
      <CardWidget
        title="Variant Buttons"
        subHeading="Primary, normal, link, icon-only and disabled states"
        sections={[
          {
            key: 'button-variants',
            content: () => {
              return (
                <>
                  <S.Buttons>
                    <PanelButtonWidget
                      label="Increment"
                      icon="plus"
                      action={increment}
                      mode={PanelButtonMode.PRIMARY}
                    />
                    <PanelButtonWidget label="Decrement" icon="minus" action={decrement} />
                    <PanelButtonWidget label="Reset" icon="redo" action={reset} mode={PanelButtonMode.LINK} />
                    <PanelButtonWidget
                      label="Docs link"
                      icon="external-link-alt"
                      action={openReactDocs}
                      mode={PanelButtonMode.LINK}
                    />
                    <PanelButtonWidget icon="star" tooltip="Icon only button" action={increment} />
                    <PanelButtonWidget label="Text only button" action={increment} />
                  </S.Buttons>
                  <S.Counter>Counter: {counter}</S.Counter>
                </>
              );
            }
          }
        ]}
      />

      <CardWidget
        title="Action Buttons"
        subHeading="Buttons generated from global action definitions"
        sections={[
          {
            key: 'button-actions-global',
            content: () => {
              return (
                <S.Buttons>
                  {CreateTodoAction.get().renderAsButton((btn) => (
                    <PanelButtonWidget {...btn} mode={PanelButtonMode.PRIMARY} />
                  ))}
                </S.Buttons>
              );
            }
          }
        ]}
      />

      <CardWidget
        title="Entity Buttons"
        subHeading="Buttons generated from actions bound to a selected todo entity"
        sections={[
          {
            key: 'button-actions-entity',
            content: () => {
              return (
                <S.Buttons>
                  {SetCurrentTodoItemAction.get().renderAsButton((btn) => (
                    <PanelButtonWidget {...btn} />
                  ))}
                  {actionStore.getActionByID<AddTodoNoteAction>(AddTodoNoteAction.ID).renderAsButton((btn) => (
                    <PanelButtonWidget {...btn} />
                  ))}
                </S.Buttons>
              );
            }
          }
        ]}
      />

      <CardWidget
        title="Validation Buttons"
        subHeading="Buttons with validator-controlled enabled/disabled behavior"
        sections={[
          {
            key: 'button-validation',
            content: () => {
              return (
                <S.Buttons>
                  <PanelButtonWidget
                    label="Validation disabled"
                    icon="lock"
                    validator={disabledByValidator}
                    action={increment}
                  />
                  <PanelButtonWidget label="Validation allowed" icon="unlock" action={increment} />
                </S.Buttons>
              );
            }
          }
        ]}
      />
    </S.Container>
  );
});

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

  export const Counter = styled.div`
    margin-top: 10px;
    color: ${(p) => p.theme.text.secondary};
  `;
}
