import * as React from 'react';
import * as _ from 'lodash';
import { CommonKeys } from '../../stores/KeyboardStore';
import { useKeyboardContext } from '../../hooks/useKeyboardContext';

export interface ListItemRenderEvent {
  ref: React.RefObject<HTMLDivElement>;
  selected: boolean;
  hover: () => any;
  select: (event: React.MouseEvent) => any;
  index: number;
}

export interface ListItem {
  key: string;
  render: (event: ListItemRenderEvent) => React.JSX.Element;
  forwardRef?: React.RefObject<HTMLDivElement>;
}

export interface ControlledListWidgetProps {
  items: ListItem[];
  initialSelected?: string;
  selected: (item: ListItem, event: React.MouseEvent) => any;
  hovered?: (item: ListItem) => any;
  useKeyboard: boolean;
}

export const ControlledListWidget: React.FC<ControlledListWidgetProps> = (props) => {
  const selectedRef = React.useRef<HTMLDivElement>(null);
  const [selected, setSelectedState] = React.useState<string>(props.initialSelected || props.items[0]?.key);

  const fireHover = React.useCallback(
    (key: string) => {
      if (!key || !props.hovered) {
        return;
      }
      props.hovered(_.find(props.items, { key }));
    },
    [props.hovered, props.items]
  );

  const setSelected = React.useCallback(
    (key: string) => {
      if (!key || selected === key) {
        return;
      }
      setSelectedState(key);
      fireHover(key);
    },
    [fireHover, selected]
  );

  useKeyboardContext({
    enabled: props.useKeyboard,
    handlers: {
      [CommonKeys.ENTER]: () => {
        props.selected(_.find(props.items, { key: selected }), null);
      },
      [CommonKeys.DOWN]: () => {
        let index = _.findIndex(props.items, { key: selected });
        index++;
        if (index > props.items.length - 1) {
          index = 0;
        }
        setSelected(props.items[index]?.key);
      },
      [CommonKeys.UP]: () => {
        let index = _.findIndex(props.items, { key: selected });
        index--;
        if (index < 0) {
          index = props.items.length - 1;
        }
        setSelected(props.items[index]?.key);
      }
    }
  });

  React.useEffect(() => {
    if (selected && selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selected]);

  React.useEffect(() => {
    if (!selected && props.items[0]) {
      setSelected(props.items[0].key);
    }
  }, [props.items, selected, setSelected]);

  React.useEffect(() => {
    if (selected) {
      fireHover(selected);
    }
  }, []);

  return (
    <>
      {_.map(props.items, (item, index) => {
        const isSelected = selected === item.key;
        return item.render({
          selected: isSelected,
          ref: isSelected ? selectedRef : null,
          index,
          hover: () => {
            if (selected === item.key) {
              fireHover(item.key);
              return;
            }
            setSelected(item.key);
          },
          select: (event) => {
            props.selected(item, event);
          }
        });
      })}
    </>
  );
};
