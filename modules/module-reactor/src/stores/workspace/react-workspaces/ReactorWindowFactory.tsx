import {
  FloatingWindowFactory,
  FloatingWindowModel,
  FloatingWindowRendererEvent
} from '@projectstorm/react-workspaces-model-floating-window';
import * as React from 'react';
import { WorkspaceEngine, WorkspaceModel } from '@projectstorm/react-workspaces-core';
import { observable } from 'mobx';
import { styled } from '../../themes/reactor-theme-fragment';

export class ReactorWindowModel extends FloatingWindowModel {
  @observable
  accessor pinned: boolean;

  /**
   * true = it's not coupled to a tray (aka a global window)
   */
  standalone: boolean;

  constructor(child: WorkspaceModel) {
    super(ReactorWindowFactory.TYPE, child);
    this.standalone = false;
    this.setSize({
      width: 300,
      height: 400
    });
    this.pinned = false;
  }
}

export class ReactorWindowFactory extends FloatingWindowFactory<ReactorWindowModel> {
  static TYPE = 'reactor-window';

  constructor() {
    super(ReactorWindowFactory.TYPE);
  }

  protected _generateModel(): ReactorWindowModel {
    return new ReactorWindowModel(null);
  }

  generateContent(event: FloatingWindowRendererEvent): React.JSX.Element {
    return <DefaultFloatingWindowWidget {...event} />;
  }
}

export interface DefaultFloatingWindowWidgetProps {
  model: FloatingWindowModel;
  engine: WorkspaceEngine;
  titlebar: React.JSX.Element;
  content: React.JSX.Element;
}

export const DefaultFloatingWindowWidget: React.FC<DefaultFloatingWindowWidgetProps> = (props) => {
  return (
    <S.Container>
      {props.titlebar}
      {props.content}
    </S.Container>
  );
};

namespace S {
  export const Container = styled.div`
    box-shadow: 0 0 20px ${(p) => p.theme.combobox.shadowColor};
    pointer-events: all;
    border: solid 1px ${(p) => p.theme.combobox.border};
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: ${(p) => p.theme.workspace.background};
  `;
}
