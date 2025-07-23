import { action, observable } from 'mobx';
import * as uuid from 'uuid';
import * as _ from 'lodash';

export enum LoadingDirectiveState {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface VisorLoadingMessage {
  message: string;
  timestamp: number;
}

export class VisorLoadingDirective {
  id: string;

  @observable
  protected accessor percentage: number;

  @observable
  accessor state: LoadingDirectiveState;

  @observable
  protected accessor messages: VisorLoadingMessage[];

  constructor(message: string = 'Loading') {
    this.messages = [];
    this.pushMessage(message);
    this.id = uuid.v4();
    this.percentage = null;
    this.state = LoadingDirectiveState.LOADING;
  }

  pushMessage(message?: string) {
    if (!message) {
      return;
    }
    this.messages.push({
      message: message,
      timestamp: Date.now()
    });
  }

  @action update(percentage: number, message?: string) {
    this.percentage = percentage;
    this.pushMessage(message);
    if (percentage === 100) {
      this.state = LoadingDirectiveState.SUCCESS;
    }
  }

  @action failed(message?: string) {
    if (this.isResolved()) {
      return;
    }
    this.percentage = 100;
    this.state = LoadingDirectiveState.ERROR;
    this.pushMessage(message);
  }

  @action complete(message?: string) {
    if (this.isResolved()) {
      return;
    }
    this.percentage = 100;
    this.state = LoadingDirectiveState.SUCCESS;
    this.pushMessage(message);
  }

  isResolved() {
    return this.state !== LoadingDirectiveState.LOADING;
  }

  getPercentage() {
    return this.percentage;
  }

  getLastMessage() {
    return _.last(this.messages);
  }
}
