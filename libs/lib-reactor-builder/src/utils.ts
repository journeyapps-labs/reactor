import { Configuration } from 'webpack';

export const sanitizeLibraryName = (module: string) => {
  return `LIB_${module.replace(/[\/-]/g, '_').replace('@', '').toUpperCase()}`;
};

export const patchExportedLibrary = (options: {
  w: Configuration;
  alias: boolean;
  module: string;
  test?: RegExp;
  dir: string;
}) => {
  const { w, module, test, alias, dir } = options;
  return {
    ...w,
    resolve: {
      ...w.resolve,
      alias: {
        ...w.resolve.alias,
        ...(alias
          ? {
              [module]: require.resolve(module)
            }
          : {})
      }
    },
    module: {
      ...w.module,
      rules: [
        ...w.module.rules,
        {
          test: test ? test : require.resolve(module, { paths: [dir] }),
          loader: 'expose-loader',
          options: {
            exposes: {
              globalName: sanitizeLibraryName(module)
            }
          }
        }
      ]
    }
  } as Configuration;
};

export const patchImportedLibrary = (options: { w: Configuration; module: string }) => {
  const { w, module } = options;
  return {
    ...w,
    externals: [
      ...(w.externals as any[]),
      {
        [module]: {
          root: sanitizeLibraryName(module),
          amd: [module],
          commonjs: [module],
          commonjs2: [module]
        }
      }
    ]
  } as Configuration;
};
