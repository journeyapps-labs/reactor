import './fonts';
import {
  CMDPalletProviderSearchEngine,
  CMDPalletStore,
  ComboBoxStore,
  keyType,
  NotificationStore,
  PrefsStore,
  ShortcutChord,
  ShortcutStore,
  UXStore,
  WorkspaceStore
} from './stores';
import { System } from './core/System';
import { setupPrefs } from './setup/setup-preferences';
import { ChangeThemeAction, CreateWorkspaceAction, ExportShortcutsAction, ResetPreferencesAction } from './actions';

import { DialogStore } from './stores/DialogStore';
import { CMDPalletPreferencesSearchEngine } from './cmd-pallet/CMDPalletPreferencesSearchEngine';
import { WorkspaceProvider } from './providers/WorkspaceProvider';
import { SwitchWorkspaceAction } from './actions/builtin-actions/SwitchWorkspaceAction';
import { SettingsPanelFactory } from './panels/settings/SettingsPanelFactory';
import { ResetWorkspacesAction } from './actions/builtin-actions/workspace/ResetWorkspacesAction';
import { VisorStore } from './stores/visor/VisorStore';
import { MediaEngine } from './media-engine/MediaEngine';
import { ImageMediaType } from './media-engine/types/images/ImageMediaType';
import { ActionShortcutHandler } from './actions/shortcuts/ActionShortcutHandler';
import { ThemeProvider } from './providers/ThemeProvider';
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
import * as _ from 'lodash';
import { ThemeStore } from './stores/themes/ThemeStore';
import { theme } from './stores/themes/reactor-theme-fragment';

import './stores/themes/built-in-themes/reactor';
import './stores/themes/built-in-themes/hexagon';
import './stores/themes/built-in-themes/journey';
import './stores/themes/built-in-themes/light';
import './stores/themes/built-in-themes/scarlet';
import './stores/themes/built-in-themes/oxide';
import { PanelEntityDefinition } from './entities-reactor/panels/PanelEntityDefinition';
import { AddPanelWorkspaceAction } from './actions/builtin-actions/workspace/AddPanelWorkspaceAction';
import { DNDStore } from './stores/dnd/DNDStore';
import { ReactorEntities } from './entities-reactor/ReactorEntities';
import { ReactorKernel } from './core/ReactorKernel';
import { CycleOpenTabsAction } from './actions/builtin-actions/workspace/CycleOpenTabsAction';
import { SearchStore } from './stores/SearchStore';
import { SimpleEntitySearchEngineComponent } from './entities/components/search/SimpleEntitySearchEngineComponent';
import { KeyboardStore } from './stores/KeyboardStore';
import { patchLightThemeEntityColors } from './stores/themes/built-in-themes/light';
import { Container } from '@journeyapps-labs/lib-ioc';
import { DateFormatVisorMetadata } from './visor/DateFormatVisorMetadata';
import { DateTimezoneVisorMetadata } from './visor/DateTimezoneVisorMetadata';
import { DialogStore2 } from './stores/dialog2/DialogStore2';

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
    const system = new System();

    ioc.bind(System).toConstantValue(system);

    const oldComboBoxStore = new ComboBoxStore();
    const comboBoxStore = new ComboBoxStore2();
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
      comboBoxStore: comboBoxStore,
      dialogStore: dialogStore
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

    system.registerAction(new ChangeThemeAction());
    system.registerAction(new ResetPreferencesAction());
    system.registerAction(new ResetWorkspacesAction());
    system.registerAction(new SwitchWorkspaceAction());
    system.registerAction(new CopyPanelURLAction());
    system.registerAction(new TabAction(true));
    system.registerAction(new TabAction(false));
    system.registerAction(new CreateWorkspaceAction());
    system.registerAction(new CycleOpenTabsAction(true));
    system.registerAction(new CycleOpenTabsAction(false));

    // exports
    system.registerAction(new ExportWorkspaceAction());
    system.registerAction(new ExportWorkspacesAction());
    system.registerAction(new ImportWorkspaceAction());
    system.registerAction(new ExportShortcutsAction());
    system.registerAction(new ImportShortcutsAction());
    system.registerAction(new ResetShortcutsAction());
    system.registerAction(new AddPanelWorkspaceAction());

    // providers (legacy)
    system.registerProvider(new WorkspaceProvider());
    system.registerProvider(new ThemeProvider());

    // entity definitions (new)
    system.registerDefinition(new ActionEntityDefinition());
    system.registerDefinition(new PanelEntityDefinition());

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
        displayName: 'Gif',
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
    const system = ioc.get(System);
    const uxStore = ioc.get(UXStore);
    const prefsStore = ioc.get(PrefsStore);
    const themeStore = ioc.get(ThemeStore);

    //!---------- MOBILE FIX ---------------
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
    });
    //!-------------------------------------

    // register panel factories for each component type
    system.getEntityDefinitions().forEach((def) => {
      def.getPanelComponents().forEach((fact) => {
        ioc.get(WorkspaceStore).registerFactory(fact.generatePanelFactory());
      });
    });

    ioc.get(WorkspaceStore).init();
    cmdPaletteStore.init();
    ioc.get(VisorStore).init();

    uxStore.init();

    system.getStores().forEach((s) => {
      s.getControls().forEach((c) => {
        prefsStore.registerPreference(c);
      });
    });
    ioc
      .get(PrefsStore)
      .init()
      .then(() => {
        ioc.get(WorkspaceStore).hydratePanelFromURL();
      });

    // register all the providers as search engines for the command pallet
    _.forEach(ioc.get(System).providers, (provider) => {
      // not all providers are search engine compatible
      if (!provider.options.cmdPallet) {
        return;
      }
      cmdPaletteStore.registerSearchEngine(
        new CMDPalletProviderSearchEngine({
          provider: provider,
          themeStore: themeStore
        })
      );
    });

    // register entity definition search engines
    system.getEntityDefinitions().forEach((def) => {
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
    });
  }
}
