const path = require('path');
const { patchExportedLibrary } = require('@journeyapps-labs/lib-reactor-builder');
module.exports = (webpack) => {
  webpack = patchExportedLibrary({
    w: webpack,
    module: 'monaco-editor',
    test: /monaco-editor\/esm\/vs\/editor\/edcore\.main\.js/,
    dir: __dirname
  });

  webpack = patchExportedLibrary({
    w: webpack,
    module: 'react-monaco-editor',
    dir: __dirname
  });

  let r = webpack.module.rules.find((v) => !!v['oneOf']);
  r.oneOf = [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            url: {
              //https://github.com/webpack-contrib/css-loader/issues/1342#issuecomment-881587038
              filter: (url) => !url.startsWith('data:image')
            }
          }
        }
      ]
    },
    ...r.oneOf
  ];

  return [
    {
      entry: {
        // Package each language's worker and give these filenames in `getWorkerUrl`
        'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
        'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
        'yaml.worker': 'monaco-yaml/yaml.worker'
      },
      output: {
        globalObject: 'self',
        filename: '[name].bundle.js',
        path: webpack.output.path
      }
    },
    {
      ...webpack,
      resolve: {
        ...webpack.resolve,
        alias: {
          ...webpack.resolve.alias,
          'lru-cache': path.join(__dirname, 'node_modules', 'lru-cache'),
          'monaco-editor/esm': 'monaco-editor/esm',
          'monaco-editor$': 'monaco-editor/esm/vs/editor/edcore.main.js'
        }
      },
      module: {
        ...webpack.module,
        rules: [
          ...webpack.module.rules,
          {
            test: /\.tmTheme/i,
            use: 'raw-loader'
          },
          {
            test: /\.(tmLanguage|wasm)$/,
            type: 'asset/resource'
          },
          {
            test: /\.json5$/i,
            loader: 'json5-loader',
            type: 'javascript/auto'
          }
        ],
        defaultRules: [
          {
            type: 'javascript/auto',
            resolve: {}
          },
          {
            test: /\.json$/i,
            type: 'json'
          }
        ]
      }
    }
  ];
};
