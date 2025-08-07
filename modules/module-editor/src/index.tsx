import { EditorModule } from './EditorModule';

require('monaco-editor/esm/vs/language/json/monaco.contribution');
require('monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution');

import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices';
import { ICodeEditorService } from 'monaco-editor/esm/vs/editor/browser/services/codeEditorService';

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
(window as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return '/module/module-editor/json.worker.bundle.js';
    } else if (label == 'yaml') {
      return '/module/module-editor/yaml.worker.bundle.js';
    }
    return '/module/module-editor/editor.worker.bundle.js';
  }
};

export const MonacoInternals = {
  StandaloneServices,
  ICodeEditorService
};
export * from './languages/logs';
export * from './languages/languages';
export * from './widgets/EditorWidget';
export * from './widgets/DualEditorWidget';
export * from './widgets/SimpleEditorWidget';
export * from './theme/theme-utils';
export * from './shortcuts/MonacoShortcutHandler';
export * from './shortcuts/MonacoShortcut';
export * from './stores/MonacoStore';
export * from './stores/MonacoThemeStore';
export * from './EditorModule';
export * from './theme-reactor/editor-theme-fragment';
export * from './utils/paths';
export * from './utils/useEditorStickyHeader';

export default EditorModule;
