import { WorkspaceModel } from '@projectstorm/react-workspaces-core';
import {
  WorkspaceTabFactory,
  WorkspaceTabModel,
  WorkspaceTabModelSerialized
} from '@projectstorm/react-workspaces-model-tabs';
import * as React from 'react';
import { MouseEvent } from 'react';
import * as _ from 'lodash';
import { Observer } from 'mobx-react';
import { ComboBoxStore } from '../../combo/ComboBoxStore';
import { ioc, inject } from '../../../inversify.config';
import { TabMicroButtonWidget } from '../../../widgets/panel/tabs/TabMicroButtonWidget';
import { WorkspaceStore } from '../WorkspaceStore';
import { ReactorPanelFactory } from './ReactorPanelFactory';
import { ReactorPanelModel } from './ReactorPanelModel';
import { ComboBoxItem } from '../../combo/ComboBoxDirectives';
import { styled } from '../../themes/reactor-theme-fragment';
import { serializeChildren } from './ReactorExpandNodeFactory';

export const TAB_BAR_HEIGHT = 30;

namespace S {
  export const Outer = styled.div`
    height: ${TAB_BAR_HEIGHT}px;
    position: relative;
    width: 100%;
  `;
  export const Container = styled.div`
    border-top: solid 2px transparent;
    border-bottom: solid 2px ${(p) => p.theme.panels.trayBackground};
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    max-width: 100%;
  `;

  export const Tabs = styled.div`
    flex-grow: 1;
    width: 100%;
    overflow: hidden;
    position: relative;
  `;

  export const TabButtons = styled.div`
    flex-grow: 0;
    display: flex;
    flex-shrink: 0;
    padding-left: 5px;
  `;
}

export class ReactorTabFactoryModel extends WorkspaceTabModel {
  defer: boolean;

  constructor() {
    super();
    this.defer = true;
    this.minimumSize.update({
      width: 100,
      height: 100
    });
  }

  toArray(): WorkspaceTabModelSerialized {
    return {
      ...super.toArray(),
      children: serializeChildren(this.children)
    };
  }

  isEmpty() {
    return _.filter(this.children, (c) => c.type === 'empty').length > 0;
  }

  setSelected(model: WorkspaceModel): this {
    if (this.defer) {
      _.defer(() => {
        super.setSelected(model);
      });
    } else {
      super.setSelected(model);
    }
    return this;
  }

  getSelected(): WorkspaceModel {
    const selected = super.getSelected();
    if (!selected && this.children.length > 0) {
      this.selected = this.children[0].id;
    }
    return super.getSelected();
  }

  removeModel(model: WorkspaceModel): this {
    super.removeModel(model);
    this.normalize();
    return;
  }

  addModel(model: WorkspaceModel, position?: number): this {
    super.addModel(model, position);
    this.normalize();
    return this;
  }

  normalize(): void {
    this.defer = false;
    const selected = this.children.filter((c) => c.type === 'empty');
    if (selected.length < this.children.length) {
      selected.forEach((s) => {
        s.delete();
      });
      this.defer = true;
      return;
    } else if (this.children.length === 0) {
      this.addModel(new WorkspaceModel('empty'));
      this.defer = true;
    }
  }
}

export class ReactorTabFactory extends WorkspaceTabFactory<ReactorTabFactoryModel> {
  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  protected _generateModel(): ReactorTabFactoryModel {
    return new ReactorTabFactoryModel();
  }

  generateTabsContainer(event): React.JSX.Element {
    // return (
    //   <Observer
    //     render={() => {
    return (
      <S.Outer>
        <S.Container>
          <S.Tabs>{event.content}</S.Tabs>
          <S.TabButtons draggable={false}>
            <TabMicroButtonWidget btn={ioc.get(WorkspaceStore).generateFullscreenButton(event.model.getSelected())} />
            <TabMicroButtonWidget
              btn={{
                icon: 'angle-down',
                action: async (e: MouseEvent) => {
                  const workspaceStore = ioc.get(WorkspaceStore);
                  const selected = await this.comboBoxStore.showComboBox(
                    _.chain(event.model.children)
                      .filter((model) => {
                        return workspaceStore.engine.getFactory(model) instanceof ReactorPanelFactory;
                      })
                      .map((model) => {
                        return {
                          title: workspaceStore.engine
                            .getFactory<ReactorPanelFactory>(model)
                            .getSimpleName(model as ReactorPanelModel),
                          key: model.id
                        } as ComboBoxItem;
                      })
                      .value(),
                    e
                  );

                  if (selected) {
                    event.model.setSelected(_.find(event.model.children, { id: selected.key }));
                  }
                }
              }}
            />
          </S.TabButtons>
        </S.Container>
      </S.Outer>
    );
    /* }}
      />
    );*/
  }
}
