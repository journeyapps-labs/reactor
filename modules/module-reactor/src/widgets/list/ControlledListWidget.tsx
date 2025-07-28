import * as React from 'react';
import * as _ from 'lodash';
import { CommonKeys, KeyboardContext, KeyboardStore } from '../../stores/KeyboardStore';
import { inject } from '../../inversify.config';

export interface ListItemRenderEvent {
  ref: React.RefObject<HTMLDivElement>;
  selected: boolean;
  select: () => any;
  index: number;
}

export interface ListItem {
  key: string;
  render: (event: ListItemRenderEvent) => React.JSX.Element;
}

export interface ControlledListWidgetProps {
  items: ListItem[];
  initialSelected?: string;
  selected: (item: ListItem) => any;
  hovered?: (item: ListItem) => any;
  useKeyboard: boolean;
}

export interface ControlledListWidgetState {
  selected: string;
}

export class ControlledListWidget extends React.Component<ControlledListWidgetProps, ControlledListWidgetState> {
  listener: any;
  selectedRef: React.RefObject<HTMLDivElement>;

  @inject(KeyboardStore)
  accessor keyboardStore: KeyboardStore;

  keyboardContext: KeyboardContext;

  constructor(props: ControlledListWidgetProps) {
    super(props);
    this.selectedRef = React.createRef();
    this.state = {
      selected: props.initialSelected || (props.items[0] && props.items[0].key)
    };
  }

  componentDidUpdate(
    prevProps: Readonly<ControlledListWidgetProps>,
    prevState: Readonly<ControlledListWidgetState>,
    snapshot?: any
  ): void {
    if (!prevProps.useKeyboard && this.props.useKeyboard) {
      this.setupKeyboard();
    } else if (prevProps.useKeyboard && !this.props.useKeyboard) {
      this.destroyKeyboard();
    }

    if (prevState.selected !== this.state.selected && this.selectedRef.current) {
      this.selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }

    // always ensure that at least one thing is selected when we update
    const first = _.first(this.props.items);
    if (!this.state.selected && first) {
      this.setState({
        selected: first.key
      });
    }
  }

  componentDidMount(): void {
    if (this.props.useKeyboard) {
      this.setupKeyboard();
    }

    // fire the first hover
    if (this.state.selected) {
      this.fireHover();
    }
  }

  componentWillUnmount(): void {
    this.destroyKeyboard();
  }

  fireHover() {
    if (this.state.selected && this.props.hovered) {
      this.props.hovered(_.find(this.props.items, { key: this.state.selected }));
    }
  }

  setSelected(key: string) {
    if (this.state.selected === key) {
      return;
    }
    this.setState(
      {
        selected: key
      },
      () => {
        this.fireHover();
      }
    );
  }

  destroyKeyboard() {
    this.keyboardContext?.dispose();
    this.keyboardContext = null;
  }

  setupKeyboard() {
    if (this.keyboardContext) {
      return;
    }

    this.keyboardContext = this.keyboardStore.pushContext();
    this.keyboardContext.handle({
      key: CommonKeys.ENTER,
      action: () => {
        this.props.selected(_.find(this.props.items, { key: this.state.selected }));
      }
    });
    this.keyboardContext.handle({
      key: CommonKeys.DOWN,
      action: () => {
        let index = _.findIndex(this.props.items, { key: this.state.selected });
        index++;
        if (index > this.props.items.length - 1) {
          index = 0;
        }
        this.setSelected(this.props.items[index].key);
      }
    });
    this.keyboardContext.handle({
      key: CommonKeys.UP,
      action: () => {
        let index = _.findIndex(this.props.items, { key: this.state.selected });
        index--;
        if (index < 0) {
          index = this.props.items.length - 1;
        }
        this.setSelected(this.props.items[index].key);
      }
    });
  }

  render() {
    return _.map(this.props.items, (item, index) => {
      const selected = this.state.selected === item.key;
      return item.render({
        selected: selected,
        ref: selected ? this.selectedRef : null,
        index: index,
        select: () => {
          this.setSelected(item.key);
        }
      });
    });
  }
}
