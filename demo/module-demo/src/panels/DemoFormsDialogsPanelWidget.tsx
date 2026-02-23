import * as React from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import {
  ComboBoxItem,
  ComboBoxStore2,
  CardWidget,
  DialogStore,
  DialogStore2,
  FormDialogDirective,
  MetadataWidget,
  PanelButtonMode,
  PanelButtonWidget,
  ReactorPanelModel,
  SimpleComboBoxDirective,
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
  const comboBoxStore2 = ioc.get(ComboBoxStore2);
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

  const runNestedComboDemo = async (position: any) => {
    const topLevelMeta = (label: string) => <span style={{ fontSize: 11, opacity: 0.6 }}>{label}</span>;

    const items: ComboBoxItem[] = [
      {
        key: 'coffee',
        title: 'Coffee',
        group: 'Drinks',
        right: topLevelMeta('42'),
        children: [
          {
            key: 'coffee-hot',
            title: 'Hot',
            group: 'Temperature',
            children: [
              {
                key: 'coffee-hot-americano',
                title: 'Americano',
                group: 'Espresso bar',
                children: [
                  { key: 'coffee-hot-americano-single', title: 'Single shot', group: 'Size' },
                  { key: 'coffee-hot-americano-double', title: 'Double shot', group: 'Size' },
                  { key: 'coffee-hot-americano-long-black', title: 'Long black', group: 'House specials' }
                ]
              },
              {
                key: 'coffee-hot-flat-white',
                title: 'Flat White',
                group: 'Espresso bar',
                children: [
                  { key: 'coffee-hot-flat-white-oat', title: 'Oat milk', group: 'Milk' },
                  { key: 'coffee-hot-flat-white-whole', title: 'Whole milk', group: 'Milk' }
                ]
              },
              {
                key: 'coffee-hot-cappuccino',
                title: 'Cappuccino',
                group: 'Espresso bar',
                children: [
                  { key: 'coffee-hot-cappuccino-dry', title: 'Dry foam', group: 'Foam' },
                  { key: 'coffee-hot-cappuccino-wet', title: 'Wet foam', group: 'Foam' }
                ]
              }
            ]
          },
          {
            key: 'coffee-iced',
            title: 'Iced',
            group: 'Temperature',
            children: [
              {
                key: 'coffee-iced-latte',
                title: 'Iced Latte',
                group: 'Cold espresso',
                children: [
                  { key: 'coffee-iced-latte-vanilla', title: 'Vanilla', group: 'Syrup' },
                  { key: 'coffee-iced-latte-caramel', title: 'Caramel', group: 'Syrup' }
                ]
              },
              {
                key: 'coffee-iced-mocha',
                title: 'Iced Mocha',
                group: 'Cold espresso',
                children: [
                  { key: 'coffee-iced-mocha-dark', title: 'Dark chocolate', group: 'Chocolate' },
                  { key: 'coffee-iced-mocha-milk', title: 'Milk chocolate', group: 'Chocolate' }
                ]
              },
              {
                key: 'coffee-iced-cold-brew',
                title: 'Cold brew',
                group: 'Cold espresso'
              }
            ]
          },
          {
            key: 'coffee-drip',
            title: 'Filter / Drip',
            group: 'Brew method',
            children: [
              { key: 'coffee-drip-house', title: 'House blend', group: 'Origins' },
              { key: 'coffee-drip-ethiopia', title: 'Ethiopia', group: 'Origins' },
              { key: 'coffee-drip-colombia', title: 'Colombia', group: 'Origins' }
            ]
          },
          {
            key: 'coffee-espresso-shot',
            title: 'Espresso shot',
            group: 'Brew method'
          }
        ]
      },
      {
        key: 'tea',
        title: 'Tea',
        group: 'Drinks',
        right: topLevelMeta('33'),
        children: [
          {
            key: 'tea-green',
            title: 'Green',
            group: 'Tea family',
            children: [
              {
                key: 'tea-green-jasmine',
                title: 'Jasmine',
                group: 'Floral',
                children: [
                  { key: 'tea-green-jasmine-hot', title: 'Hot', group: 'Serve' },
                  { key: 'tea-green-jasmine-iced', title: 'Iced', group: 'Serve' }
                ]
              },
              {
                key: 'tea-green-sencha',
                title: 'Sencha',
                group: 'Japanese',
                children: [
                  { key: 'tea-green-sencha-first-flush', title: 'First flush', group: 'Harvest' },
                  { key: 'tea-green-sencha-late-flush', title: 'Late flush', group: 'Harvest' }
                ]
              },
              {
                key: 'tea-green-matcha',
                title: 'Matcha',
                group: 'Japanese'
              }
            ]
          },
          {
            key: 'tea-black',
            title: 'Black',
            group: 'Tea family',
            children: [
              {
                key: 'tea-black-earl-grey',
                title: 'Earl Grey',
                group: 'Blended',
                children: [
                  { key: 'tea-black-earl-grey-bergamot', title: 'Extra bergamot', group: 'Blend' },
                  { key: 'tea-black-earl-grey-classic', title: 'Classic', group: 'Blend' }
                ]
              },
              {
                key: 'tea-black-assam',
                title: 'Assam',
                group: 'Single origin',
                children: [
                  { key: 'tea-black-assam-strong', title: 'Strong brew', group: 'Strength' },
                  { key: 'tea-black-assam-light', title: 'Light brew', group: 'Strength' }
                ]
              },
              {
                key: 'tea-black-darjeeling',
                title: 'Darjeeling',
                group: 'Single origin'
              }
            ]
          },
          {
            key: 'tea-herbal',
            title: 'Herbal',
            group: 'Tea family',
            children: [
              { key: 'tea-herbal-chamomile', title: 'Chamomile', group: 'Caffeine free' },
              { key: 'tea-herbal-peppermint', title: 'Peppermint', group: 'Caffeine free' },
              { key: 'tea-herbal-ginger', title: 'Ginger', group: 'Caffeine free' }
            ]
          },
          {
            key: 'tea-iced',
            title: 'Iced tea',
            group: 'Ready to drink'
          }
        ]
      },
      {
        key: 'pastry',
        title: 'Pastry',
        group: 'Food',
        right: topLevelMeta('12'),
        children: [
          {
            key: 'pastry-croissant',
            title: 'Croissant',
            group: 'Baked',
            children: [
              { key: 'pastry-croissant-butter', title: 'Butter', group: 'Style' },
              { key: 'pastry-croissant-almond', title: 'Almond', group: 'Style' }
            ]
          },
          { key: 'pastry-muffin', title: 'Muffin', group: 'Baked' },
          { key: 'pastry-scone', title: 'Scone', group: 'Baked' }
        ]
      },
      {
        key: 'water',
        title: 'Water',
        group: 'Drinks',
        right: topLevelMeta('8'),
        children: [
          { key: 'water-still', title: 'Still', group: 'Type' },
          { key: 'water-sparkling', title: 'Sparkling', group: 'Type' },
          {
            key: 'water-flavored',
            title: 'Flavored',
            group: 'Type',
            children: [
              { key: 'water-flavored-lemon', title: 'Lemon', group: 'Flavor' },
              { key: 'water-flavored-lime', title: 'Lime', group: 'Flavor' },
              { key: 'water-flavored-berry', title: 'Berry', group: 'Flavor' }
            ]
          }
        ]
      },
      {
        key: 'merch-gift-card',
        title: 'Gift card',
        group: 'Retail',
        right: topLevelMeta('leaf')
      },
      {
        key: 'retail-mug',
        title: 'House mug',
        group: 'Retail',
        right: topLevelMeta('leaf')
      }
    ];

    await comboBoxStore2.show(
      new SimpleComboBoxDirective({
        title: 'Nested combobox demo',
        subtitle: 'Pick a leaf node',
        event: position,
        items
      })
    );
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
        title="Combobox playground"
        subHeading="Nested side-by-side combobox proof of concept"
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
    min-height: 100%;
    box-sizing: border-box;
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
