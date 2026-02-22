import './fonts';
import { CMDPalletStore } from './stores/CMDPalletStore';
import { ComboBoxStore } from './stores/combo/ComboBoxStore';
import { keyType, ShortcutChord } from './stores/shortcuts/Shortcut';
import { NotificationStore } from './stores/NotificationStore';
import { PrefsStore } from './stores/PrefsStore';
import { ShortcutStore } from './stores/shortcuts/ShortcutStore';
import { UXStore } from './stores/UXStore';
import { WorkspaceStore } from './stores/workspace/WorkspaceStore';
import { System } from './core/System';
import { setupPrefs } from './setup/setup-preferences';
import { ChangeThemeAction } from './actions/builtin-actions/ChangeThemeAction';
import { CreateWorkspaceAction } from './actions/builtin-actions/workspace/CreateWorkspaceAction';
import { ExportShortcutsAction } from './actions/builtin-actions/shortcuts/ExportShortcutsAction';
import { ResetPreferencesAction } from './actions/builtin-actions/ResetPreferencesAction';

import { DialogStore } from './stores/DialogStore';
import { CMDPalletPreferencesSearchEngine } from './cmd-pallet/CMDPalletPreferencesSearchEngine';
import { SwitchWorkspaceAction } from './actions/builtin-actions/SwitchWorkspaceAction';
import { SettingsPanelFactory } from './panels/settings/SettingsPanelFactory';
import { ResetWorkspacesAction } from './actions/builtin-actions/workspace/ResetWorkspacesAction';
import { VisorStore } from './stores/visor/VisorStore';
import { MediaEngine } from './media-engine/MediaEngine';
import { ImageMediaType } from './media-engine/types/images/ImageMediaType';
import { ActionShortcutHandler } from './actions/shortcuts/ActionShortcutHandler';
import { CopyPanelURLAction } from './actions/builtin-actions/CopyPanelURLAction';
import { TabAction } from './actions/builtin-actions/TabAction';
import { ExportWorkspaceAction } from './actions/builtin-actions/workspace/ExportWorkspaceAction';
import { ExportWorkspacesAction } from './actions/builtin-actions/workspace/ExportWorkspacesAction';
import { ImportWorkspaceAction } from './actions/builtin-actions/workspace/ImportWorkspaceAction';
import { ImportShortcutsAction } from './actions/builtin-actions/shortcuts/ImportShortcutsAction';
import { ResetShortcutsAction } from './actions/builtin-actions/shortcuts/ResetShortcutsAction';
import { AbstractReactorModule } from './core/AbstractReactorModule';
import { GuideStore } from './stores/guide/GuideStore';
import { LayerManager } from './stores/layer/LayerManager';
import { IDEStatusVisorMetadata } from './visor/IDEStatusVisorMetadata';
import { ActionEntityDefinition } from './entities-reactor/actions/ActionEntityDefinition';
import { ComboBoxStore2 } from './stores/combo2/ComboBoxStore2';
import { BatchStore } from './stores/batch/BatchStore';
import { EmptyPanelWorkspaceFactory } from './panels/empty/EmptyPanelWorkspaceFactory';
import { ThemeStore } from './stores/themes/ThemeStore';
import { theme } from './stores/themes/reactor-theme-fragment';

import './stores/themes/built-in-themes/reactor';
import './stores/themes/built-in-themes/reactor-dark';
import './stores/themes/built-in-themes/hexagon';
import './stores/themes/built-in-themes/journey';
import './stores/themes/built-in-themes/light';
import './stores/themes/built-in-themes/scarlet';
import './stores/themes/built-in-themes/oxide';
import './stores/themes/built-in-themes/bunny';

import { PanelEntityDefinition } from './entities-reactor/panels/PanelEntityDefinition';
import { ThemeEntityDefinition } from './entities-reactor/themes/ThemeEntityDefinition';
import { AddPanelWorkspaceAction } from './actions/builtin-actions/workspace/AddPanelWorkspaceAction';
import { DNDStore } from './stores/dnd/DNDStore';
import { ReactorEntities } from './entities-reactor/ReactorEntities';
import { ReactorKernel } from './core/ReactorKernel';
import { CycleOpenTabsAction } from './actions/builtin-actions/workspace/CycleOpenTabsAction';
import { SearchStore } from './stores/SearchStore';
import { SimpleEntitySearchEngineComponent } from './entities/components/search/SimpleEntitySearchEngineComponent';
import { KeyboardStore } from './stores/KeyboardStore';
import { patchLightThemeEntityColors } from './stores/themes/built-in-themes/light';
import { Container } from '@journeyapps-labs/common-ioc';
import { EntityDefinition } from './entities/EntityDefinition';
import { AbstractStore } from './stores/AbstractStore';
import { DateFormatVisorMetadata } from './visor/DateFormatVisorMetadata';
import { DateTimezoneVisorMetadata } from './visor/DateTimezoneVisorMetadata';
import { DialogStore2 } from './stores/dialog2/DialogStore2';
import { ActionStore } from './stores/actions/ActionStore';
import { WorkspaceEntityDefinition } from './entities-reactor/workspaces/WorkspaceEntityDefinition';
import { ioc } from './inversify.config';
import { createRoot } from 'react-dom/client';
import React from 'react';

export class ReactorModule extends AbstractReactorModule {
  constructor() {
    super({
      name: 'Reactor core'
    });
  }

  /**
   This is called automatically in the index.html
   */
  static preboot(modules: any[]) {
    const kernel = new ReactorKernel();
    modules.forEach((m) => {
      kernel.registerModule(new m());
    });

    kernel.boot();
  }

  register(ioc: Container) {
    const oldComboBoxStore = new ComboBoxStore();
    const comboBoxStore = new ComboBoxStore2();
    const actionStore = new ActionStore({
      comboBoxStore2: comboBoxStore
    });
    const system = new System({
      actionStore: actionStore,
      comboBoxStore2: comboBoxStore
    });

    ioc.bind(System).toConstantValue(system);
    ioc.bind(ActionStore).toConstantValue(actionStore);

    const visorStore = new VisorStore();
    const workspaceStore = new WorkspaceStore();
    const keyboardStore = new KeyboardStore();
    const guideStore = new GuideStore({
      workspaceStore: workspaceStore
    });
    const prefsStore = new PrefsStore();
    const cmdPaletteStore = new CMDPalletStore();
    const uxStore = new UXStore({
      system,
      comboBoxStore,
      workspaceStore
    });
    const themeStore = new ThemeStore();
    const dndStore = new DNDStore();
    const mediaEngine = new MediaEngine(workspaceStore);
    const dialogStore = new DialogStore();
    const dialogStore2 = new DialogStore2();
    const searchStore = new SearchStore();
    const batchStore = new BatchStore({
      visorStore: visorStore,
      system: system,
      actionStore: actionStore,
      comboBoxStore: comboBoxStore,
      dialogStore: dialogStore
    });

    // register entity definition search engines and preferences before registrations happen
    system.registerListener({
      storeRegistered: (store: AbstractStore) => {
        store.getControls().forEach((control) => {
          prefsStore.registerPreference(control);
        });
      },
      definitionRegistered: (def: EntityDefinition) => {
        def.getPanelComponents().forEach((fact) => {
          workspaceStore.registerFactory(fact.generatePanelFactory());
        });

        let searchEngines = def.getSearchEngines();
        searchEngines = searchEngines.filter((s) => s instanceof SimpleEntitySearchEngineComponent);
        if (searchEngines.length === 0) {
          return;
        }

        searchEngines.forEach((s) => {
          const engine = s.getCmdPaletteSearchEngine();
          if (engine) {
            cmdPaletteStore.registerSearchEngine(engine);
          }
        });
      }
    });

    system.addStore(GuideStore, guideStore);
    system.addStore(WorkspaceStore, workspaceStore);
    system.addStore(PrefsStore, prefsStore);
    system.addStore(ThemeStore, themeStore);
    system.addStore(DNDStore, dndStore);
    system.addStore(UXStore, uxStore);
    system.addStore(BatchStore, batchStore);
    system.addStore(SearchStore, searchStore);
    system.addStore(KeyboardStore, keyboardStore);

    themeStore.addThemeFragment(theme);

    ioc.bind(ComboBoxStore).toConstantValue(oldComboBoxStore);
    ioc.bind(ComboBoxStore2).toConstantValue(comboBoxStore);
    ioc.bind(DialogStore).toConstantValue(dialogStore);
    ioc.bind(DialogStore2).toConstantValue(dialogStore2);
    ioc.bind(CMDPalletStore).toConstantValue(cmdPaletteStore);
    ioc.bind(VisorStore).toConstantValue(visorStore);
    ioc.bind(MediaEngine).toConstantValue(mediaEngine);
    ioc.bind(ShortcutStore).toConstantValue(new ShortcutStore());
    ioc.bind(NotificationStore).toConstantValue(new NotificationStore());
    ioc.bind(LayerManager).toConstantValue(new LayerManager());

    actionStore.registerAction(new ChangeThemeAction());
    actionStore.registerAction(new ResetPreferencesAction());
    actionStore.registerAction(new ResetWorkspacesAction());
    actionStore.registerAction(new SwitchWorkspaceAction());
    actionStore.registerAction(new CopyPanelURLAction());
    actionStore.registerAction(new TabAction(true));
    actionStore.registerAction(new TabAction(false));
    actionStore.registerAction(new CreateWorkspaceAction());
    actionStore.registerAction(new CycleOpenTabsAction(true));
    actionStore.registerAction(new CycleOpenTabsAction(false));

    // exports
    actionStore.registerAction(new ExportWorkspaceAction());
    actionStore.registerAction(new ExportWorkspacesAction());
    actionStore.registerAction(new ImportWorkspaceAction());
    actionStore.registerAction(new ExportShortcutsAction());
    actionStore.registerAction(new ImportShortcutsAction());
    actionStore.registerAction(new ResetShortcutsAction());
    actionStore.registerAction(new AddPanelWorkspaceAction());

    // entity definitions (new)
    system.registerDefinition(new ActionEntityDefinition());
    system.registerDefinition(new PanelEntityDefinition());
    system.registerDefinition(new ThemeEntityDefinition());
    system.registerDefinition(new WorkspaceEntityDefinition());

    // register panels
    workspaceStore.registerFactory(new SettingsPanelFactory());
    workspaceStore.registerFactory(new EmptyPanelWorkspaceFactory());

    visorStore.registerActiveMetadata(new IDEStatusVisorMetadata());
    visorStore.registerActiveMetadata(new DateFormatVisorMetadata());
    visorStore.registerActiveMetadata(new DateTimezoneVisorMetadata());

    // media engine
    mediaEngine.registerMediaType(
      new ImageMediaType({
        mime: 'image/png',
        extensions: ['.png'],
        displayName: 'PNG',
        icon: 'image'
      })
    );
    mediaEngine.registerMediaType(
      new ImageMediaType({
        mime: 'image/jpeg',
        extensions: ['.jpeg', '.jpg'],
        displayName: 'Jpeg',
        icon: 'image'
      })
    );
    mediaEngine.registerMediaType(
      new ImageMediaType({
        mime: 'image/gif',
        extensions: ['.gif'],
        displayName: 'GIF',
        icon: 'image'
      })
    );
    mediaEngine.registerMediaType(
      new ImageMediaType({
        mime: 'image/svg',
        extensions: ['.svg'],
        displayName: 'SVG',
        icon: 'image'
      })
    );

    //shortcuts
    ioc.get(ShortcutStore).registerHandler(new ActionShortcutHandler());

    // cmd pallet search engines
    cmdPaletteStore.registerSearchEngine(new CMDPalletPreferencesSearchEngine(prefsStore, themeStore));
    cmdPaletteStore.registerCategory({
      engines: [
        system.getDefinition(ReactorEntities.ACTION).getSearchEngines()[0].getCmdPaletteSearchEngine({ limit: 100 })
      ],
      hotkeys: [
        new ShortcutChord([{ type: keyType.META }, { type: keyType.SHIFT }, { type: keyType.STANDARD, key: 'a' }]),
        new ShortcutChord([{ type: keyType.CTRL }, { type: keyType.SHIFT }, { type: keyType.STANDARD, key: 'a' }])
      ],
      name: 'Actions'
    });

    setupPrefs();
  }

  async init(ioc: Container): Promise<any> {
    patchLightThemeEntityColors();

    const cmdPaletteStore = ioc.get(CMDPalletStore);
    const uxStore = ioc.get(UXStore);
    const prefsStore = ioc.get(PrefsStore);
    const workspaceStore = ioc.get(WorkspaceStore);
    const visorStore = ioc.get(VisorStore);

    //!---------- MOBILE FIX ---------------
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
    });
    //!-------------------------------------

    cmdPaletteStore.init();
    visorStore.init();

    // these purposefully left async
    Promise.all([workspaceStore.init(), prefsStore.init(), uxStore.init()]).then(() => {
      this.render();
      workspaceStore.hydratePanelFromURL();
    });
  }

  render() {
    document.querySelector('.loader').remove();
    const root = ioc.get(UXStore).rootComponent;
    const rootElement = createRoot(document.querySelector('#application'));
    rootElement.render(React.createElement(root));
  }
}
