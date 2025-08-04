import {
  AbstractReactorModule,
  CMDPalletStore,
  PrefsStore,
  ShortcutStore,
  System,
  ThemeStore,
  WorkspaceStore
} from '@journeyapps-labs/reactor-mod';
import { Container } from '@journeyapps-labs/common-ioc';
import { MonacoStore } from './stores/MonacoStore';
import { MonacoShortcutHandler } from './shortcuts/MonacoShortcutHandler';
import { MonacoCommandPalletSearchEngine } from './MonacoCommandPalletSearchEngine';
import * as React from 'react';
import { MonacoThemeStore } from './stores/MonacoThemeStore';
import { ChangeEditorThemeAction } from './actions/ChangeEditorThemeAction';
import { EditorThemeProvider } from './providers/EditorThemeProvider';
import { SmartEditorThemePreferencesWidget } from './theme/SmartEditorThemePreferencesWidget';
import { patchThemeService } from './theme/patchThemeService';
import { EnableVimSetting } from './settings/VimSupportSetting';
import { theme } from './theme-reactor/editor-theme-fragment';
import { MonacoKeybindingStore } from './stores/keybindings/MonacoKeybindingStore';

export class EditorModule extends AbstractReactorModule {
  constructor() {
    super({
      name: 'Monaco editor'
    });
  }

  register(ioc: Container) {
    const prefsStore = ioc.get(PrefsStore);
    const themeStore = ioc.get(ThemeStore);
    const cmdPalletStore = ioc.get(CMDPalletStore);
    const system = ioc.get(System);
    const workspaceStore = ioc.get(WorkspaceStore);

    // Monaco has scrollbars that start at 11 :yuno:
    workspaceStore.engine.layerManager.setInitialZIndex(12);

    // new instances
    const monacoThemeStore = new MonacoThemeStore();
    const monacoStore = new MonacoStore();
    const monacoKeybindingsStore = new MonacoKeybindingStore({
      editorStore: monacoStore,
      cmdPaletteStore: cmdPalletStore
    });
    const handler = new MonacoShortcutHandler({
      keybindingStore: monacoKeybindingsStore
    });
    const commandPallet = new MonacoCommandPalletSearchEngine({
      keybindingStore: monacoKeybindingsStore,
      handler
    });

    // register stores
    system.addStore(MonacoStore, monacoStore);
    system.addStore(MonacoThemeStore, monacoThemeStore);
    system.addStore(MonacoKeybindingStore, monacoKeybindingsStore);

    ioc.get(ShortcutStore).registerHandler(handler);
    cmdPalletStore.registerSearchEngine(commandPallet);
    prefsStore.registerPreferenceCategory({
      key: 'editor',
      name: 'Code Theme',
      generateUI: () => {
        return <SmartEditorThemePreferencesWidget />;
      }
    });
    prefsStore.registerPreference(new EnableVimSetting());
    system.registerAction(new ChangeEditorThemeAction());
    system.registerProvider(new EditorThemeProvider(monacoThemeStore));

    // changing an IDE theme should change the corresponding editor theme
    const selectedTheme = themeStore.selectedTheme;
    selectedTheme.registerListener({
      updated(): any {
        monacoThemeStore.selectedTheme.setItem(
          monacoThemeStore.getMonacoThemeForReactorTheme(selectedTheme.entity.key)
        );
      }
    });

    themeStore.addThemeFragment(theme);
    patchThemeService();
  }

  async init(ioc: Container): Promise<any> {
    ioc.get(MonacoStore).init();
    ioc.get(MonacoKeybindingStore).init();
  }
}
