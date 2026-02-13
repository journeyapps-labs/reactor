import * as React from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import {
  CardWidget,
  DialogStore,
  DialogStore2,
  FormDialogDirective,
  MetadataWidget,
  PanelButtonMode,
  PanelButtonWidget,
  ReactorPanelModel,
  StatusCardState,
  StatusCardWidget,
  ioc
} from '@journeyapps-labs/reactor-mod';
import { DemoFormModel } from '../forms/DemoFormModel';

export interface DemoFormsDialogsPanelWidgetProps {
  model: ReactorPanelModel;
}

export const DemoFormsDialogsPanelWidget: React.FC<DemoFormsDialogsPanelWidgetProps> = observer(() => {
  const dialogStore = ioc.get(DialogStore);
  const dialogStore2 = ioc.get(DialogStore2);
  const [inlineForm, setInlineForm] = React.useState(() => new DemoFormModel());

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

  const runCustomDialog = async () => {
    await dialogStore.showCustomDialog({
      title: 'Custom dialog',
      message: 'Select one of the custom actions below',
      btns: [{ label: 'Close' }],
      generateUI: () => {
        return (
          <S.CustomBody>
            <StatusCardWidget
              status={StatusCardState.LOADING}
              label={{
                icon: 'flask',
                label: 'Custom dialog status card'
              }}
              meta={[
                {
                  label: 'Feature',
                  value: 'StatusCardWidget',
                  color: 'cyan'
                },
                {
                  label: 'Context',
                  value: 'Dialog body',
                  color: 'green'
                }
              ]}
            >
              {() => {
                return (
                  <>
                    <MetadataWidget label="Capability" value="Composable UI" color="orange" />
                    <MetadataWidget label="State" value="Demonstrated" color="blue" />
                  </>
                );
              }}
            </StatusCardWidget>
          </S.CustomBody>
        );
      }
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

  const resetInlineForm = () => {
    setInlineForm(new DemoFormModel());
  };

  return (
    <S.Container>
      <CardWidget
        title="Dialogs playground"
        subHeading="Legacy + directive dialog test flows"
        sections={[
          {
            key: 'dialogs-actions',
            content: () => {
              return (
                <S.Buttons>
                  <PanelButtonWidget label="Message" icon="comment" action={runMessageDialog} />
                  <PanelButtonWidget label="Confirm" icon="question-circle" action={runConfirmDialog} />
                  <PanelButtonWidget label="Input" icon="keyboard" action={runInputDialog} />
                  <PanelButtonWidget label="Custom" icon="puzzle-piece" action={runCustomDialog} />
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
        title="Form playground"
        subHeading="Inline preview with all modeled form input types"
        sections={[
          {
            key: 'form-preview',
            content: () => {
              return <S.FormContainer>{inlineForm.render()}</S.FormContainer>;
            }
          },
          {
            key: 'form-actions',
            content: () => {
              return (
                <S.Buttons>
                  <PanelButtonWidget
                    label="Open demo form in dialog"
                    icon="window-maximize"
                    action={runFormDialog}
                    mode={PanelButtonMode.PRIMARY}
                  />
                  <PanelButtonWidget label="Reset inline form" icon="redo" action={resetInlineForm} />
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
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
  `;

  export const Buttons = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `;

  export const FormContainer = styled.div`
    min-height: 140px;
  `;

  export const CustomBody = styled.div`
    min-width: 340px;
  `;
}
