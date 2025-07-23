import * as path from 'path';
import * as webpack from 'webpack';
import { Configuration, ExternalItem } from 'webpack';
import * as fs from 'fs';
import TerserPlugin from 'terser-webpack-plugin';
import { WatchIgnorePlugin } from './WatchIgnorePlugin';
import { patchExportedLibrary, patchImportedLibrary } from './utils';

export const generateCommonWebpack = (dir: string): Configuration => {
  const p = require(path.join(dir, 'package.json'));
  const reactor = require(path.join(dir, 'reactor.config.json'));
  const production = process.env.NODE_ENV === 'production';
  const is_reactor_core = p.name.endsWith('reactor-mod');

  // check for dependent reactor modules
  const externals: ExternalItem[] = Object.keys(p.dependencies).filter((depName) => {
    return fs.existsSync(path.join(dir, 'node_modules', depName, 'reactor.config.json'));
  });

  const external_libraries = [
    'react',
    'react-dom',
    '@emotion/react',
    '@emotion/styled',
    'lodash',
    'mobx',
    'mobx-react',
    'uuid',
    'luxon'
  ];

  let config = {
    entry: [path.join(dir, 'dist', 'index.js')],
    output: {
      publicPath: path.join('/module', reactor.slug, '/'),
      path: path.join(dir, 'dist-module'),
      filename: 'bundle.js',
      library: p.name,
      libraryTarget: 'umd',
      assetModuleFilename: '[hash][ext][query]'
    },
    externalsType: 'umd',
    externals: ['stream/web', ...externals],
    watchOptions: {
      ignored: ['**/*.ts', '**/node_modules/**', '**/dist-module/**']
    },
    resolveLoader: {
      modules: [path.join(__dirname, '../node_modules'), 'node_modules'],
      symlinks: true
    },
    resolve: {
      symlinks: true,
      extensions: ['.json', '.js', '.jsx'],
      alias: {
        'process/browser': require.resolve('process/browser'),
        '@emotion/react': require.resolve('@emotion/react'),
        '@emotion/styled': require.resolve('@emotion/styled'),
        mobx: require.resolve('mobx'),
        'mobx-react': require.resolve('mobx-react'),
        uuid: require.resolve('uuid')
      },
      modules: [
        path.join(__dirname, '../../../node_modules'),
        path.join(dir, '../../node_modules'),
        path.join(dir, 'node_modules')
      ],
      fallback: {
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
        zlib: require.resolve('browserify-zlib'),
        assert: require.resolve('assert/'),
        fs: false,
        tty: false
      }
    },
    ignoreWarnings: [/Failed to parse source map/],
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 2017,
            keep_classnames: true
          }
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          enforce: 'pre',
          use: ['source-map-loader']
        },
        // some libraries have their files with preserve JSX enabled
        {
          test: /\.jsx$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-react']
            }
          }
        },
        {
          oneOf: [
            {
              test: /\.(woff|woff2|eot|ttf|otf|svg|png|gif|ico)$/,
              type: 'asset/resource'
            },
            {
              test: /\.css$/,
              use: [
                'style-loader',
                {
                  loader: 'css-loader'
                }
              ]
            }
          ]
        }
      ]
    },
    plugins: [
      new WatchIgnorePlugin(),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      }),
      new webpack.DefinePlugin({
        'process.browser': 'true'
      }),
      // It will add the banner message after minimizers and any asset manipulation
      new webpack.BannerPlugin({
        raw: true,
        footer: true,
        banner: `window.reactorModuleLoaded('${reactor.slug}')`,
        stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT
      })
    ],
    devtool: production ? 'source-map' : 'cheap-module-source-map',
    mode: production ? 'production' : 'development'
  } as webpack.Configuration;

  config = external_libraries.reduce((prev, cur) => {
    if (is_reactor_core) {
      return patchExportedLibrary({
        w: prev,
        alias: false,
        module: cur,
        dir: __dirname
      });
    }
    return patchImportedLibrary({
      w: prev,
      module: cur
    });
  }, config);

  return config;
};
