# Module editor

Make sure to put this in any modules that will need monaco (in the custom webpack.config.js):

```js
webpack = patchImportedLibrary({
  "w": webpack,
  "module": 'monaco-editor'
})
```