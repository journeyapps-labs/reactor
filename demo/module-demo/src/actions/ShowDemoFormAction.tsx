import {
  Action,
  ActionEvent,
  ColumnsFormModel,
  DialogStore2,
  FormDialogDirective,
  inject,
  ioc,
  MultiSelectInput,
  SelectInput,
  System,
  TextAreaInput,
  TextInput,
  TextInputType
} from '@journeyapps-labs/reactor-mod';
import { ColumnsFormModelRenderMode } from '@journeyapps-labs/reactor-mod';

export class ShowDemoFormAction extends Action {
  @inject(DialogStore2)
  accessor dialogStore2: DialogStore2;

  static ID = 'SHOW_DEMO_FORM';

  constructor() {
    super({
      id: ShowDemoFormAction.ID,
      name: 'Show Demo Form',
      icon: 'eye'
    });
  }

  async fireEvent(event: ActionEvent): Promise<any> {
    let form = new ColumnsFormModel({
      columnWidths: [200, 200],
      columnSpacing: 20,
      mode: ColumnsFormModelRenderMode.DIVISIONS
    });
    form.addInput(
      new TextInput({
        name: 'text',
        label: 'Text',
        required: true
      }),
      0
    );
    form.addInput(
      new TextInput({
        name: 'password',
        label: 'Password',
        inputType: TextInputType.PASSWORD
      }),
      0
    );
    form.addInput(
      new TextAreaInput({
        name: 'textarea',
        label: 'Textarea'
      }),
      0
    );
    form.addInput(
      new MultiSelectInput({
        name: 'multiselect',
        label: 'Multiselect',
        value: ['b'],
        options: {
          a: 'First Option',
          b: 'Second Option',
          c: 'Third long option'
        }
      }),
      1
    );
    form.addInput(
      new SelectInput({
        name: 'select',
        label: 'Select',
        value: 'b',
        options: {
          a: 'First Option',
          b: 'Second Option',
          c: 'Third long option'
        }
      }),
      1
    );

    const directive = new FormDialogDirective({
      form,
      title: 'Demo form!',
      handler: async (form) => {
        // simulate a slow operation
        await new Promise((resolve) => {
          setTimeout(resolve, 3000);
        });
        console.log(form.value());
      }
    });

    await this.dialogStore2.showDialog(directive);
  }

  static get() {
    return ioc.get(System).getActionByID<ShowDemoFormAction>(ShowDemoFormAction.ID);
  }
}
