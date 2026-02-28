import _ from 'lodash';
import { SearchEvent } from '@journeyapps-labs/lib-reactor-search';
import { EntityPresenterComponent, SelectEntityListener } from './EntityPresenterComponent';
import { observable } from 'mobx';
import { ReactorIcon } from '../../../widgets/icons/IconWidget';
import { AbstractValueControl } from '../../../controls/AbstractValueControl';
import { ButtonControl } from '../../../controls/ButtonControl';
import { BaseObserver, BaseObserverInterface } from '@journeyapps-labs/common-utils';
import { SetControl, SetControlOption } from '../../../controls/SetControl';

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

export enum GroupingOptionValue {
  NONE = 'none',
  COMPLEX_NAME = 'complexName',
  TAGS = 'tags'
}

export type ActualGroupingOptionValue = GroupingOptionValue.COMPLEX_NAME | GroupingOptionValue.TAGS;

export interface GroupBySettingOptions {
  allowedGroupingSettings?: {
    complexName?: boolean;
    tags?: boolean;
  };
  defaultGroupingSetting?: GroupingOptionValue;
}

export interface GroupByEntityOptions<T> {
  entities: T[];
  describe?: (entity: T) => {
    complexName?: string;
    tags?: string[];
  };
}

export abstract class AbstractPresenterContext<
  T = any,
  State extends {} = {},
  Settings extends {} = {},
  Listener extends PresenterContextListener = PresenterContextListener
> extends BaseObserver<Listener> {
  static GROUP_BY_SETTING_KEY = 'groupBy';
  public state: State;

  @observable
  accessor settings: Map<string, PresenterSetting>;
  @observable
  accessor toolbarButtons: Set<ButtonControl>;

  constructor(
    public presenter: EntityPresenterComponent,
    options: {
      groupBySetting?: GroupBySettingOptions;
    } = {}
  ) {
    super();
    this.state = null;
    this.settings = new Map();
    this.toolbarButtons = new Set();
    if (options.groupBySetting) {
      this.registerGroupBySetting(options.groupBySetting);
    }
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

  protected registerGroupBySetting(options: GroupBySettingOptions) {
    const allowed = options.allowedGroupingSettings || {};
    const groupByOptions: SetControlOption<GroupingOptionValue>[] = [
      { key: GroupingOptionValue.NONE, icon: 'layer-group', label: 'No grouping' }
    ];

    if (allowed.complexName) {
      groupByOptions.push({
        key: GroupingOptionValue.COMPLEX_NAME,
        icon: 'grip-lines',
        label: 'Secondary label'
      });
    }

    if (allowed.tags) {
      groupByOptions.push({
        key: GroupingOptionValue.TAGS,
        icon: 'tags',
        label: 'Tags'
      });
    }

    if (groupByOptions.length <= 1) {
      return;
    }

    this.addSetting({
      icon: 'layer-group',
      label: 'Group by',
      key: AbstractPresenterContext.GROUP_BY_SETTING_KEY,
      control: new SetControl<GroupingOptionValue>({
        initialValue: options.defaultGroupingSetting || GroupingOptionValue.NONE,
        options: groupByOptions
      })
    });
  }

  protected groupBySelectedSetting<Item extends { complexName?: string; tags?: string[] }>(
    items: Item[],
    selectedGrouping: ActualGroupingOptionValue,
    fallback: string
  ): Record<string, Item[]> {
    if (selectedGrouping === GroupingOptionValue.COMPLEX_NAME) {
      return _.groupBy(items, (item) => item.complexName || fallback);
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
    return _.mapValues(grouped, (groupedEntries) => groupedEntries.map((entry) => entry.item));
  }

  isGroupingEnabled(): boolean {
    const controlValues = this.getControlValues() as Record<string, GroupingOptionValue>;
    const selectedGrouping = controlValues[AbstractPresenterContext.GROUP_BY_SETTING_KEY] || GroupingOptionValue.NONE;
    return selectedGrouping !== GroupingOptionValue.NONE;
  }

  groupEntitiesBySelectedSetting<T>(options: GroupByEntityOptions<T>): Record<string, T[]> {
    const controlValues = this.getControlValues() as Record<string, GroupingOptionValue>;
    const selectedGrouping = controlValues[AbstractPresenterContext.GROUP_BY_SETTING_KEY] || GroupingOptionValue.NONE;
    const describe =
      options.describe ||
      ((entity: T) => {
        return (this.presenter.definition as any).describeEntity(entity);
      });

    const grouped = this.groupBySelectedSetting(
      options.entities.map((entity) => {
        return {
          entity,
          ...describe(entity)
        };
      }),
      selectedGrouping as ActualGroupingOptionValue,
      'Ungrouped'
    );

    return _.mapValues(grouped, (groupedEntities) => groupedEntities.map((entry) => entry.entity));
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
