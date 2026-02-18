const { patchImportedLibrary } = require('@journeyapps-labs/lib-reactor-builder');
module.exports = (w) => {
  w = patchImportedLibrary({ w, module: 'monaco-editor' });
  return w;
};
