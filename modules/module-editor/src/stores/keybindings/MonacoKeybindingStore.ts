import * as _ from 'lodash';
import { MenuRegistry } from 'monaco-editor/esm/vs/platform/actions/common/actions.js';
import { KeyCodeChord, MonacoStoreAction } from './definitions';
import { MonacoEditorType, MonacoStore } from '../MonacoStore';
import { AbstractStore, CMDPalletStore } from '@journeyapps-labs/reactor-mod';
import { KeybindingsRegistry } from './KeybindingsRegistry';
import { autorun, IReactionDisposer } from 'mobx';

export interface PatchActionOperation {
  action: MonacoStoreAction;
  binding: KeyCodeChord;
  binding2: KeyCodeChord;
}

export interface MonacoKeybindingStoreOptions {
  editorStore: MonacoStore;
  cmdPaletteStore: CMDPalletStore;
}

export class MonacoKeybindingStore extends AbstractStore {
  actions: MonacoStoreAction[];
  focusedEditor: MonacoEditorType;
  keybindingRegistry: KeybindingsRegistry;

  constructor(protected options2: MonacoKeybindingStoreOptions) {
    super({
      name: 'MONACO_KEYBINDING_STORE'
    });
    this.actions = [];
    this.focusedEditor = null;
    this.keybindingRegistry = new KeybindingsRegistry();
    options2.editorStore.registerListener({
      gotEditor: (editor) => {
        let autorunDisposer: IReactionDisposer;
        const l1 = editor.onDidFocusEditorText(() => {
          this.focusedEditor = editor;
        });
        const l3 = editor.onDidBlurEditorText(() => {
          setTimeout(() => {
            /*
              If the cmd palette is opened while we have focus, we don't want to clear the focus editor, because
              we need it when using the `MonacoCommandPalletSearchEngine`. In all other cases, we want to clear
              this so that the Reactor Actions appear first
             */
            if (this.focusedEditor === editor && options2.cmdPaletteStore.show === null) {
              this.focusedEditor = null;
            } else {
              // wait for cmd palette to close and only then clear the focus editor
              autorunDisposer = autorun(() => {
                if (options2.cmdPaletteStore.show === null) {
                  this.focusedEditor = null;
                  autorunDisposer?.();
                  autorunDisposer = null;
                }
              });
            }
          }, 1000);
        });
        const l2 = editor.onDidDispose(() => {
          l1.dispose();
          l2.dispose();
          l3.dispose();
          autorunDisposer?.();
        });
      }
    });
    this.keybindingRegistry.registerListener({
      saved: () => {
        for (const editor of _.values(options2.editorStore.editors) as MonacoEditorType[]) {
          editor._standaloneKeybindingService.updateResolver();
        }
      }
    });
  }

  protected async _init(): Promise<void> {
    this.keybindingRegistry.load();
    this.actions = await this.getDefaultActions();
  }

  getActionFromID(id: string): MonacoStoreAction {
    return _.find(this.actions, { id: id });
  }

  getContextualActions() {
    if (!this.focusedEditor) {
      return [];
    }
    return this.focusedEditor.getSupportedActions().filter((a) => a.isSupported());
  }

  unbindAction(actionID: string, bindings: KeyCodeChord[]) {
    this.keybindingRegistry.getCommandKeybinding(actionID).deleteKeybinding({
      chords: bindings
    });
  }

  updateAction(operation: PatchActionOperation) {
    this.keybindingRegistry.getCommandKeybinding(operation.action.id).addKeybinding({
      chords: [operation.binding, ...(operation.binding2 ? [operation.binding2] : [])]
    });
  }

  getDefaultActions = _.memoize(async (): Promise<MonacoStoreAction[]> => {
    let actionMap = new Map<string, string>();

    // actions we can get from the editor
    const editorHandle = await this.options2.editorStore.createHeadlessEditorInstance();
    Array.from(editorHandle.editor._actions.values()).forEach((a) => {
      actionMap.set(a.id, a.label);
    });
    editorHandle.dispose();

    // actions we get from the menu (yeah for some reason they are separate)
    Array.from(MenuRegistry.getCommands().values()).forEach((a: any) => {
      actionMap.set(a.id, a.title.value);
    });

    // actions we can get from the editor
    return _.map(Array.from(actionMap.entries()), ([id, label]) => {
      const commandBinding = this.keybindingRegistry.getCommandKeybinding(id);
      return {
        bindings: commandBinding.getDefaults(),
        id: id,
        label: label
      } as MonacoStoreAction;
    });
  });
}
