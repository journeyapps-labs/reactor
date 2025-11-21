export * from 'monaco-editor/esm/vs/editor/edcore.main';

// edcore doesn't contain these by default, but they _used_ to be included
export * as json from 'monaco-editor/esm/vs/language/json/monaco.contribution';
export * as html from 'monaco-editor/esm/vs/language/html/monaco.contribution';
export * as css from 'monaco-editor/esm/vs/language/css/monaco.contribution';
