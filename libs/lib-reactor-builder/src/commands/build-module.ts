import webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';
import { generateCommonWebpack, ModuleWebpackConfigContext } from '../webpack.config';
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

    const commonWebpackConfig = generateCommonWebpack(modulePath);
    let webpackConfig: webpack.Configuration | webpack.Configuration[] = commonWebpackConfig;

    if (fs.existsSync(moduleWebpackPath)) {
      const moduleWebpackFunc: (
        config: webpack.Configuration,
        context: ModuleWebpackConfigContext
      ) => webpack.Configuration | webpack.Configuration[] = require(moduleWebpackPath);
      webpackConfig = moduleWebpackFunc(commonWebpackConfig, { webpack });
    }

    const createCompiler = webpack as unknown as (
      config: webpack.Configuration | webpack.Configuration[]
    ) => webpack.Compiler | webpack.MultiCompiler;
    const compiler = createCompiler(webpackConfig);

    const callback = (resolve: (compiled: boolean) => any) => {
      return (err, stats) => {
        if (err) {
          // Handle errors here
          console.log('Error', err.toString());
          process.exit(1);
          return;
        }
        if (stats?.hasErrors()) {
          console.log(stats.toString());
          resolve(false);
          if (!yargs.watch) {
            process.exitCode = 1;
          }
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
