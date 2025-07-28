import { AbstractActionParameter, AbstractActionParameterOptions } from './AbstractActionParameter';
import { ParameterizedActionEvent } from '../ParameterizedAction';
import { DialogStore } from '../../../stores/DialogStore';
import { inject } from '../../../inversify.config';

export interface TextActionParameterOptions extends AbstractActionParameterOptions {
  label: string;
  desc?: string;
}

export class TextActionParameter extends AbstractActionParameter<TextActionParameterOptions, string> {
  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  async decode(value: any): Promise<string> {
    return value;
  }

  async encode(value: string): Promise<any> {
    return value;
  }

  async getValue(event: Omit<ParameterizedActionEvent, 'id'>): Promise<boolean> {
    const val = await this.dialogStore.showInputDialog({
      title: this.options.label,
      message: this.options.desc
    });
    if (!val) {
      return false;
    }
    event.entities[this.options.name] = val;
    return true;
  }
}
