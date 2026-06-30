import express, { Application } from 'express';
import * as path from 'path';
import { ReactorModule } from './ReactorModule';
import { CheerioAPI } from 'cheerio';

export const serveModules = (options: { app: Application; modules: ReactorModule[] }) => {
  options.modules.forEach((m) => {
    options.app.use(`/module/${m.config.slug}`, express.static(path.join(m.options.directory, 'dist-module')));
  });
};

export const createModuleLoaderContentTransformer = ($: CheerioAPI, modules: ReactorModule[]) => {
  let module_names_window = modules.map((m) => m.packageJson.name);
  modules.forEach((m) =>
    $('head').append(
      `<script nonce="SCRIPT_NONCE"
        defer
        data-module="${m.packageJson.name}" 
        src="/module/${m.config.slug}/bundle.js" 
        type="text/javascript" />`
    )
  );
  $('head').append(`
<script nonce="SCRIPT_NONCE">
    window.addEventListener('DOMContentLoaded', async (event) => {
      // get all the reactor module classes
      const module_classes = ${JSON.stringify(module_names_window)}.map(m => {
        if(!window[m]){
          console.error('Module: ' + m +' was not loaded correctly.');
        }
        return window[m].default;
      });

      // call preboot on all of them if they have that method (such as the ReactorModule which inits the kernel)
      module_classes.forEach(module => {
        if (module.preboot) {
          module.preboot(module_classes);
        }
      });
    });
</script>`);
};
