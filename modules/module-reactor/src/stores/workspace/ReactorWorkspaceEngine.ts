import { DebugLayer, overConstrainRecomputeBehavior, WorkspaceEngine } from '@projectstorm/react-workspaces-core';
import { ReactorWindowFactory, ReactorWindowModel } from './react-workspaces/ReactorWindowFactory';
import { ReactorTabFactory, ReactorTabFactoryModel } from './react-workspaces/ReactorTabFactory';
import { ReactorTrayFactory, ReactorTrayModel } from './react-workspaces/ReactorTrayFactory';
import { ReactorPanelFactory } from './react-workspaces/ReactorPanelFactory';
import {
  draggingItemBehavior,
  getDirectiveForWorkspaceNode
} from '@projectstorm/react-workspaces-behavior-panel-dropzone';
import { ConvertToTrayZone, getDirectiveForTrayModel } from '@projectstorm/react-workspaces-dropzone-plugin-tray';
import { ConvertToTabZone, getDirectiveForTabModel } from '@projectstorm/react-workspaces-dropzone-plugin-tabs';
import { draggingItemDividerBehavior } from '@projectstorm/react-workspaces-behavior-divider-dropzone';
import { resizingBehavior } from '@projectstorm/react-workspaces-behavior-resize';
import { ReactorExpandNodeFactory } from './react-workspaces/ReactorExpandNodeFactory';
import { ioc } from '../../inversify.config';
import { ThemeStore } from '../themes/ThemeStore';
import { theme } from '../themes/reactor-theme-fragment';

export class ReactorWorkspaceEngine extends WorkspaceEngine {
  windowFactory: ReactorWindowFactory;
  tabFactory: ReactorTabFactory;
  trayFactory: ReactorTrayFactory;
  nodeFactory: ReactorExpandNodeFactory;

  constructor() {
    super();

    this.nodeFactory = new ReactorExpandNodeFactory();
    this.windowFactory = new ReactorWindowFactory();
    this.tabFactory = new ReactorTabFactory();
    this.trayFactory = new ReactorTrayFactory({
      windowFactory: this.windowFactory,
      installIconPositionListener: true,
      installEngineLockListener: true
    });

    this.registerFactory(this.windowFactory);
    this.registerFactory(this.trayFactory);
    this.registerFactory(this.tabFactory);
    this.registerFactory(this.nodeFactory);

    // setup all the behaviors
    draggingItemBehavior({
      engine: this,
      getTheme: () => {
        const store = ioc.get(ThemeStore);
        const colors = store.getCurrentTheme(theme);
        return {
          blur: 2,
          background: colors.workspace.overlayBackground,
          borderColor: colors.workspace.overlayBorder,
          backgroundEntered: colors.workspace.overlayBackgroundHover,
          borderColorEntered: colors.workspace.overlayBorderHover,
          splitButtonTheme: {
            background: colors.workspace.overlayBorderHover,
            backgroundEntered: colors.workspace.overlayBorderHover
          },
          transformButtonTheme: {
            borderColor: colors.workspace.overlayBorderHover,
            borderColorEntered: colors.workspace.overlayBorderHover,
            backgroundEntered: colors.workspace.overlayBorderHover,
            text: {
              color: colors.text.primary,
              size: 14
            },
            icon: {
              color: colors.text.primary,
              size: 20
            }
          }
        };
      },
      getDropZoneForModel: (model) => {
        return (
          getDirectiveForTrayModel(model) ||
          getDirectiveForWorkspaceNode({
            node: model,
            transformZones: [ConvertToTabZone(this.tabFactory), ConvertToTrayZone(this.trayFactory)],
            generateParentNode: () => this.nodeFactory.generateModel()
          }) ||
          getDirectiveForTabModel(model)
        );
      },
      debug: false
    });
    draggingItemDividerBehavior({
      engine: this,
      theme: () => {
        const store = ioc.get(ThemeStore);
        const colors = store.getCurrentTheme(theme);
        return {
          color: colors.workspace.overlayDividerColor,
          colorEnter: colors.workspace.overlayDividerHover
        };
      }
    });
    overConstrainRecomputeBehavior({
      engine: this
    });
    resizingBehavior(this);

    // // !------------- DEVELOPER ------------!
    // // TODO add this to debug settings
    // this.layerManager.addLayer(new DebugLayer({
    //   resizeDividers: true,
    //   panels: true
    // }))
  }

  generateStandaloneWindowModel() {
    const m = this.windowFactory.generateModel() as ReactorWindowModel;
    m.pinned = true;
    m.standalone = true;
    return m;
  }

  generateReactorTabModel(): ReactorTabFactoryModel {
    return this.tabFactory.generateModel();
  }

  generateReactorTrayModel(): ReactorTrayModel {
    return this.trayFactory.generateModel();
  }

  addReactorPanelFactory(factory: ReactorPanelFactory) {
    this.tabFactory.addRenderer(factory);
    this.trayFactory.addRenderer(factory);
    this.nodeFactory.addRenderer(factory);
    this.windowFactory.addRenderer(factory);
    this.registerFactory(factory);
  }
}
