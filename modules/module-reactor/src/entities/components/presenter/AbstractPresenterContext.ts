import _ from 'lodash';
import { SearchEvent } from '@journeyapps-labs/lib-reactor-search';
import { EntityPresenterComponent, SelectEntityListener } from './EntityPresenterComponent';
import { observable } from 'mobx';
import { ReactorIcon } from '../../../widgets/icons/IconWidget';
import { AbstractValueControl } from '../../../controls/AbstractValueControl';
import { ButtonControl } from '../../../controls/ButtonControl';
import { BaseObserver, BaseObserverInterface } from '@journeyapps-labs/common-utils';

export interface RenderCollectionOptions<T> {
  entities: T[];
  searchEvent?: SearchEvent;
  events?: BaseObserverInterface<SelectEntityListener<T>>;
}

export interface PresenterContextListener {
  stateChanged?: () => any;
  disposed?: () => any;
}

export type SerializedPresenterContext<State extends {} = {}, Settings extends {} = {}> = {
  state: State;
  controlValues: Settings;
};

export interface PresenterSetting {
  icon: ReactorIcon;
  label: string;
  key: string;
  control: AbstractValueControl;
}

export interface ExposedPresenterSetting extends PresenterSetting {
  component: EntityPresenterComponent;
  context: AbstractPresenterContext;
}

export abstract class AbstractPresenterContext<
  T = any,
  State extends {} = {},
  Settings extends {} = {},
  Listener extends PresenterContextListener = PresenterContextListener
> extends BaseObserver<Listener> {
  public state: State;

  @observable
  accessor settings: Map<string, PresenterSetting>;
  @observable
  accessor toolbarButtons: Set<ButtonControl>;

  constructor(public presenter: EntityPresenterComponent) {
    super();
    this.state = null;
    this.settings = new Map();
    this.toolbarButtons = new Set();
  }

  dispose() {
    this.iterateListeners((cb) => cb.disposed?.());
  }

  setState(state: State) {
    this.state = state;
    this.iterateListeners((cb) => cb.stateChanged?.());
  }

  deserialize(data: SerializedPresenterContext<State, Settings>) {
    if (data.state) {
      this.state = data.state;
    }
    _.forEach(data.controlValues, (value, key) => {
      this.settings.get(key).control.value = value;
    });
  }

  serialize(): SerializedPresenterContext<State, Settings> {
    return {
      state: this.state,
      controlValues: this.getControlValues()
    };
  }

  getControls(): AbstractValueControl[] {
    return Array.from(this.settings.values()).map((s) => s.control);
  }

  getControlValues(): Settings {
    return _.chain(Array.from(this.settings.entries()))
      .keyBy(([key]) => key)
      .mapValues(([key, setting]) => setting.control.value)
      .value() as Settings;
  }

  getDefaultSettings(): Settings {
    return this.getSettings().reduce((prev, cur) => {
      prev[cur.key] = cur.control.value;
      return prev;
    }, {}) as Settings;
  }

  addSetting(setting: PresenterSetting) {
    this.settings.set(setting.key, setting);
  }

  addToolbarButton(btn: ButtonControl) {
    this.toolbarButtons.add(btn);
  }

  removeSetting(key: string) {
    this.settings.delete(key);
  }

  getSettings(): ExposedPresenterSetting[] {
    return Array.from(this.settings.values()).map((s) => {
      return {
        ...s,
        component: this.presenter,
        context: this
      };
    });
  }

  abstract render(entity: T): React.JSX.Element;

  abstract renderCollection(event: RenderCollectionOptions<T>): React.JSX.Element;
}
