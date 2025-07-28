import webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';
import { generateCommonWebpack } from '../webpack.config';
import { args } from '../yargs';

args.command<{ module: string; entry: boolean; watch: boolean }>(
  `build <module>`,
  'build the module',
  (y) => {
    return y.option('watch', {
      type: 'boolean',
      default: false
    });
  },
  async (yargs) => {
    const modulePath = path.join(process.cwd(), yargs.module);
    const moduleWebpackPath = path.join(modulePath, 'webpack.config.js');

    let webpackConfig = generateCommonWebpack(modulePath);

    if (fs.existsSync(moduleWebpackPath)) {
      const moduleWebpackFunc = require(moduleWebpackPath);
      webpackConfig = moduleWebpackFunc(webpackConfig);
    }

    const compiler = webpack(webpackConfig);

    const callback = (resolve: (compiled: boolean) => any) => {
      return (err, stats) => {
        if (err) {
          // Handle errors here
          console.log('Error', err.toString());
          process.exit(1);
          return;
        }
        if (stats.hasErrors()) {
          console.log(stats.toString());
          resolve(false);
          return;
        }
        resolve(true);
      };
    };

    if (yargs.watch) {
      compiler.watch(
        {},
        callback((compiled) => {
          if (compiled) {
            console.log('compiled!');
          }
        })
      );
    } else {
      await new Promise<boolean>((resolve) => {
        compiler.run(callback(resolve));
      });
    }
  }
);
