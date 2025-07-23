import * as React from 'react';
import { CommandPalletCategoryWidget } from './CommandPalletCategoryWidget';
import * as _ from 'lodash';
import { MouseEvent, useEffect, useRef } from 'react';
import { CMDPalletSearchEngineResult, CommandPalletSearchResultEntry } from '../../cmd-pallet/CMDPalletSearchEngine';
import { observer } from 'mobx-react';
import { MousePosition } from '../combo/SmartPositionWidget';

export interface SmartCommandPalletCategorywidgetProps {
  result: CMDPalletSearchEngineResult;
  highlighted: string;
  entered: (entry: CommandPalletSearchResultEntry) => any;
  selected: (entry: CommandPalletSearchResultEntry, position: MousePosition) => any;
  clear: () => any;
  close: () => any;
  scrollIntoViewEnabled: boolean;
}

@observer
export class SmartCommandPalletCategorywidget extends React.Component<SmartCommandPalletCategorywidgetProps> {
  componentDidUpdate(
    prevProps: Readonly<SmartCommandPalletCategorywidgetProps>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    if (this.props.highlighted) {
      // loading has finished so check if the key is still valid
      if (!this.props.result.loading) {
        for (let entry of this.props.result.results) {
          if (entry.key === this.props.highlighted) {
            return;
          }
        }
        //if we get here, the highlighted entry doesn't exist anymore
        this.props.clear();
      }
    }
  }

  render() {
    if (!this.props.result.loading && this.props.result.results.length === 0) {
      return null;
    }

    return (
      <CommandPalletCategoryWidget
        close={() => {
          this.props.close();
        }}
        btns={this.props.result.options.buttons}
        showMore={this.props.result.options.showMoreText}
        showMoreAction={() => {
          this.props.result.options.showMore?.();
        }}
        loading={this.props.result.loading}
        name={this.props.result.engine.options.displayName}
      >
        {_.map(this.props.result.getLimitedResults(), (res) => {
          return (
            <EntryWrapper
              scrollIntoViewEnabled={this.props.scrollIntoViewEnabled}
              key={res.key}
              res={res}
              onClicked={(event) => {
                this.props.selected(res, event);
              }}
              onEntered={() => {
                this.props.entered(res);
              }}
              selected={this.props.highlighted === res.key}
            />
          );
        })}
      </CommandPalletCategoryWidget>
    );
  }
}

export interface EntryWrapperProps {
  res: CommandPalletSearchResultEntry;
  selected: boolean;
  onClicked: (event: MouseEvent) => any;
  onEntered: () => any;
  scrollIntoViewEnabled: boolean;
}

export const EntryWrapper: React.FC<EntryWrapperProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (props.selected && ref.current && props.scrollIntoViewEnabled) {
      ref?.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [props.selected]);
  return (
    <>
      {props.res.getWidget({
        key: props.res.key,
        ref,
        selected: props.selected,
        mouseClicked: (event: MouseEvent) => {
          props.onClicked(event);
        },
        mouseEntered: () => {
          props.onEntered();
        }
      })}
    </>
  );
};
