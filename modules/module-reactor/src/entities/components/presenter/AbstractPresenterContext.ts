import _ from 'lodash';
import { SearchEvent } from '@journeyapps-labs/lib-reactor-search';
import { EntityPresenterComponent, SelectEntityListener } from './EntityPresenterComponent';
import { observable } from 'mobx';
import { ReactorIcon } from '../../../widgets/icons/IconWidget';
import { AbstractValueControl } from '../../../controls/AbstractValueControl';
import { ButtonControl } from '../../../controls/ButtonControl';
import { BaseObserver, BaseObserverInterface } from '@journeyapps-labs/common-utils';
import { SetControl } from '../../../controls/SetControl';

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

export type GroupingOptionValue = 'none' | 'label2' | 'tags';
export type ActualGroupingOptionValue = Exclude<GroupingOptionValue, 'none'>;

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

  protected registerGroupBySetting(options: {
    key: string;
    allowedGroupingSettings?: {
      label2?: boolean;
      tags?: boolean;
    };
    defaultGroupingSetting?: GroupingOptionValue;
    label?: string;
    icon?: ReactorIcon;
  }) {
    this.removeSetting(options.key);

    const allowed = options.allowedGroupingSettings || {};
    const groupByOptions = [{ key: 'none', icon: 'layer-group' as any, label: 'No grouping' }];
    if (allowed.label2) {
      groupByOptions.push({
        key: 'label2',
        icon: 'grip-lines' as any,
        label: 'Secondary label'
      });
    }
    if (allowed.tags) {
      groupByOptions.push({
        key: 'tags',
        icon: 'tags' as any,
        label: 'Tags'
      });
    }

    if (groupByOptions.length <= 1) {
      return;
    }

    const allowedOptionKeys = new Set(groupByOptions.map((option) => option.key));
    const defaultGrouping = allowedOptionKeys.has(options.defaultGroupingSetting || 'none')
      ? options.defaultGroupingSetting || 'none'
      : 'none';

    this.addSetting({
      icon: options.icon || ('layer-group' as any),
      label: options.label || 'Group by',
      key: options.key,
      control: new SetControl<GroupingOptionValue>({
        initialValue: defaultGrouping,
        options: groupByOptions as any
      })
    });
  }

  protected getGroupingSetting(key: string): GroupingOptionValue {
    const controlValues = this.getControlValues() as Record<string, GroupingOptionValue>;
    return controlValues[key] || 'none';
  }

  protected getSelectedGroupingSetting(key: string): GroupingOptionValue {
    return this.getGroupingSetting(key);
  }

  protected groupBySelectedSetting<Item extends { label2?: string; tags?: string[] }>(
    items: Item[],
    selectedGrouping: ActualGroupingOptionValue,
    fallback: string
  ): Map<string, Item[]> {
    if (selectedGrouping === 'label2') {
      const grouped = _.groupBy(items, (item) => item.label2 || fallback);
      return new Map(Object.entries(grouped));
    }

    const taggedEntries = _.flatMap(items, (item) => {
      const tags = (item.tags || []).filter((tag) => !!tag);
      const selectedTags = tags.length > 0 ? tags : [fallback];
      return selectedTags.map((tag) => ({
        key: tag,
        item
      }));
    });

    const grouped = _.groupBy(taggedEntries, (entry) => entry.key);
    return new Map(
      Object.entries(grouped).map(([key, groupedEntries]) => {
        return [key, groupedEntries.map((entry) => entry.item)];
      })
    );
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
