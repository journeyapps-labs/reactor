import * as React from 'react';
import { AbstractInteractiveSetting } from '../../../settings/AbstractInteractiveSetting';
import { PrefsStore } from '../../../stores/PrefsStore';
import { inject } from '../../../inversify.config';
import { IndividualSettingsWidget } from '../IndividualSettingsWidget';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import { ProviderControl } from '../../../settings/ProviderControl';
import { CardWidget } from '../../../widgets';
import { styled } from '../../../stores/themes/reactor-theme-fragment';
import { SearchablePanelWidget } from '../../../widgets/search/SearchablePanelWidget';
import { EntityControl } from '../../../controls/EntityControl';
import { SearchEvent, SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';

namespace S {
  export const Card = styled(CardWidget)`
    margin-bottom: 5px;
    margin-right: 5px;
    &:last-of-type {
      margin-bottom: 0;
    }
  `;

  export const Setting = styled(IndividualSettingsWidget)`
    margin-bottom: 2px;

    &:last-of-type {
      margin-bottom: 0;
    }
  `;
}

interface ControlResult {
  control: AbstractInteractiveSetting;
  match: SearchEventMatch;
}

@observer
export class UserSettingsWidget<P extends {} = {}> extends React.Component<P> {
  @inject(PrefsStore)
  accessor prefsStore: PrefsStore;

  getInteractiveControlGroups(search: SearchEvent): {
    [category: string]: ControlResult[];
  } {
    return _.chain(this.prefsStore.getInteractiveControls())
      .map((c) => {
        return { match: search.matches(c.options.name), control: c };
      })
      .filter((c) => !!c.match)
      .groupBy((result) => {
        return result.control.options.category;
      })
      .value();
  }

  /**
   * Sorted alphabetically by default
   */
  sortGroups(groups: string[]) {
    return groups.sort();
  }

  sortControls(controls: ControlResult[]) {
    return _.chain(controls)
      .sortBy([(c) => c.control.options.name])
      .sortBy([(c) => (c.control instanceof ProviderControl ? -1 : 1)])
      .sortBy([(c) => (c.control instanceof EntityControl ? -1 : 1)])
      .value();
  }

  render() {
    return (
      <SearchablePanelWidget
        getContent={(event) => {
          const groups = this.getInteractiveControlGroups(event);
          const groupNames = this.sortGroups(_.keys(groups));
          return (
            <>
              {_.map(groupNames, (group) => {
                const controls = groups[group];
                return (
                  <S.Card
                    title={group}
                    key={group}
                    sections={[
                      {
                        key: 'main',
                        content: () => {
                          return (
                            <>
                              {this.sortControls(controls).map((result) => (
                                <S.Setting
                                  search={result.match}
                                  title={result.control.options.name}
                                  description={result.control.options.description}
                                  key={result.control.options.key}
                                >
                                  {result.control.generateControl()}
                                </S.Setting>
                              ))}
                            </>
                          );
                        }
                      }
                    ]}
                  />
                );
              })}
            </>
          );
        }}
      />
    );
  }
}
