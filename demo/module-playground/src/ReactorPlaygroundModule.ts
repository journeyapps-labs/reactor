import { Container } from '@journeyapps-labs/common-ioc';
import { AbstractReactorModule, UXStore, WorkspaceStore } from '@journeyapps-labs/reactor-mod';
import { DemoBodyWidget } from './BodyWidget';
import { setupWorkspaces } from './setupWorkspaces';
import { PlaygroundPanelFactory } from './panels/PlaygroundPanelFactory';
import { PlaygroundDialogsComboboxesPanelWidget } from './panels/PlaygroundDialogsComboboxesPanelWidget';
import { PlaygroundFormsPanelWidget } from './panels/PlaygroundFormsPanelWidget';
import { PlaygroundCardsPanelWidget } from './panels/PlaygroundCardsPanelWidget';
import { PlaygroundButtonsPanelWidget } from './panels/PlaygroundButtonsPanelWidget';
import { PlaygroundEditorsPanelWidget } from './panels/PlaygroundEditorsPanelWidget';
import { PlaygroundTreeSearchPanelWidget } from './panels/tree/PlaygroundTreeSearchPanelWidget';

export class ReactorPlaygroundModule extends AbstractReactorModule {
  constructor() {
    super({
      name: 'Reactor playground module'
    });
  }

  register(ioc: Container) {
    const workspaceStore = ioc.get(WorkspaceStore);

    workspaceStore.registerFactory(
      new PlaygroundPanelFactory({
        type: 'playground.dialogs-comboboxes',
        name: 'Dialogs + Comboboxes',
        icon: 'sitemap',
        widget: PlaygroundDialogsComboboxesPanelWidget
      })
    );
    workspaceStore.registerFactory(
      new PlaygroundPanelFactory({
        type: 'playground.tree-search',
        name: 'Tree + Search',
        icon: 'search',
        widget: PlaygroundTreeSearchPanelWidget
      })
    );
    workspaceStore.registerFactory(
      new PlaygroundPanelFactory({
        type: 'playground.forms',
        name: 'Forms',
        icon: 'list',
        widget: PlaygroundFormsPanelWidget
      })
    );
    workspaceStore.registerFactory(
      new PlaygroundPanelFactory({
        type: 'playground.cards',
        name: 'Layout',
        icon: 'id-card',
        widget: PlaygroundCardsPanelWidget
      })
    );
    workspaceStore.registerFactory(
      new PlaygroundPanelFactory({
        type: 'playground.buttons',
        name: 'Buttons',
        icon: 'mouse-pointer',
        widget: PlaygroundButtonsPanelWidget
      })
    );
    workspaceStore.registerFactory(
      new PlaygroundPanelFactory({
        type: 'playground.editors',
        name: 'Editors',
        icon: 'code',
        widget: PlaygroundEditorsPanelWidget
      })
    );

    setupWorkspaces();
  }

  async init(ioc: Container): Promise<any> {
    const uxStore = ioc.get<UXStore>(UXStore);
    uxStore.setRootComponent(DemoBodyWidget);
  }
}
