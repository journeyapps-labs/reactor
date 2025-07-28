import * as React from 'react';
import * as _ from 'lodash';
import { Observer } from 'mobx-react';
import { ReactorPanelModel } from './ReactorPanelModel';
import {
  RenderTitleBarEvent,
  WorkspaceModelFactory,
  WorkspaceModelFactoryEvent,
  WorkspaceNodePanelRenderer
} from '@projectstorm/react-workspaces-core';
import { PanelWidget } from '../../../widgets/panel/panel/PanelWidget';
import { ActionValidator } from '../../../actions/validators/ActionValidator';
import { Btn } from '../../../definitions/common';
import { TabRenderer, TabRendererEvent } from '@projectstorm/react-workspaces-model-tabs';
import { TrayModelPanelRenderer, TrayModelPanelRendererEvent } from '@projectstorm/react-workspaces-model-tray';
import {
  FloatingWindowRenderer,
  FloatingWindowSubRendererEvent
} from '@projectstorm/react-workspaces-model-floating-window';
import { TabWidget } from '../../../widgets/panel/tabs/TabWidget';
import { WidgetTrayItem } from '../../../widgets/panel/tray/WidgetTrayItem';
import { SmartPanelTitleWidget } from '../../../widgets/panel/panel/SmartPanelTitleWidget';
import { PanelPlaceholderWidgetProps } from '../../../widgets/panel/panel/PanelPlaceholderWidget';
import { ReactorIcon } from '../../../widgets/icons/IconWidget';
import { ReactorWindowModel } from './ReactorWindowFactory';

export interface AbstractReactorPanelFactoryOptions {
  icon: ReactorIcon;
  icon2?: ReactorIcon;
  color?: string;
  name: string;
  category?: string;
  type: string;
  isMultiple: boolean;
  fullscreen?: boolean;
  padding?: boolean;
  /**
   * Panel can be serialized to URL when active
   * @default false
   */
  urlEnabled?: boolean;
  /**
   * User can create this panel through configurator or cmd pallet
   * @default true
   */
  allowManualCreation?: boolean;
  validators?: ActionValidator[];
}

export interface EditorPanelSiblingSuggestion {
  placeholder: PanelPlaceholderWidgetProps;
  score: number;
  panelTitle: string;
}

export abstract class ReactorPanelFactory<T extends ReactorPanelModel = ReactorPanelModel>
  extends WorkspaceModelFactory<T>
  implements TabRenderer<T>, WorkspaceNodePanelRenderer<T>, TrayModelPanelRenderer<T>, FloatingWindowRenderer<T>
{
  options: AbstractReactorPanelFactoryOptions;

  constructor(options: AbstractReactorPanelFactoryOptions) {
    super(options.type);
    this.options = {
      ...options,
      color: options.color || '#fff',
      allowManualCreation: options.allowManualCreation == null ? true : options.allowManualCreation
    };
  }

  protected abstract generatePanelContent(event: WorkspaceModelFactoryEvent<T>): React.JSX.Element;

  generateContent(event: WorkspaceModelFactoryEvent<T>): React.JSX.Element {
    return (
      <PanelWidget urlEnabled={this.options.urlEnabled} padding={this.options.padding} event={event} factory={this}>
        {this.generatePanelContent(event)}
      </PanelWidget>
    );
  }

  generateEditorPanelSiblingSuggestion(): EditorPanelSiblingSuggestion | null {
    return null;
  }

  getAdditionalButtons(event: RenderTitleBarEvent<T>): Btn[] {
    return [];
  }

  matchesModel(newModel: T, existingModel: T) {
    return _.isEqual(_.omit(newModel.toArray(), 'id'), _.omit(existingModel.toArray(), 'id'));
  }

  // !------- TABS -------------

  getTabIcon(event: TabRendererEvent<T>) {
    return this.options.icon as any;
  }

  getSimpleName(model: T): string {
    return this.options.name;
  }

  protected generatePanelTabInternal(event: TabRendererEvent<T>) {
    return (
      <TabWidget
        icon={this.getTabIcon(event)}
        factory={this}
        engine={event.engine}
        model={event.model}
        selected={event.selected}
        title={this.getSimpleName(event.model)}
      />
    );
  }

  renderTab(event: TabRendererEvent<T>): React.JSX.Element {
    // we wrap this in an observer, so we can auto repaint when tab icons or other props repaint
    return (
      <Observer
        children={() => {
          return this.generatePanelTabInternal(event);
        }}
      />
    );
  }

  // !--------------- RENDERING ---------------

  matchModel(model: T): boolean {
    return model.type === this.type;
  }

  renderIcon(event: TrayModelPanelRendererEvent<T>): React.JSX.Element {
    return <WidgetTrayItem icon={this.options.icon} selected={event.selected} name={this.options.name} />;
  }

  // !--------------- RENDERING TITLEBAR ---------------

  renderTitleBar(event: RenderTitleBarEvent<T>): React.JSX.Element {
    return (
      <SmartPanelTitleWidget
        btns={this.getAdditionalButtons(event)}
        fullscreen={this.options.fullscreen}
        icon={this.options.icon}
        icon2={this.options.icon2}
        color={this.options.color}
        name={this.getSimpleName(event.model)}
        event={event}
        factory={this}
      />
    );
  }

  generateToolbar(event: WorkspaceModelFactoryEvent<T>) {
    return null;
  }

  renderWindowTitle(event: FloatingWindowSubRendererEvent<T>): any {
    return (
      <Observer
        render={() => {
          const window = event.model.parent as ReactorWindowModel;
          return (
            <SmartPanelTitleWidget
              fullscreen={this.options.fullscreen}
              icon={this.options.icon}
              icon2={this.options.icon2}
              color={this.options.color}
              name={this.getSimpleName(event.model)}
              event={event}
              btns={[
                ...this.getAdditionalButtons(event),
                !window.standalone
                  ? {
                      icon: 'thumbtack' as any,
                      tooltip: 'Pin',
                      highlight: window.pinned,
                      action: () => {
                        window.pinned = !window.pinned;
                      }
                    }
                  : null
              ].filter((f) => !!f)}
              factory={this}
            />
          );
        }}
      />
    );
  }
}
