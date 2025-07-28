import express, { Application, NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import { UAParser } from 'ua-parser-js';
import { ReactorModulePWAConfig } from './ReactorConfig';
import { ReactorModule } from './ReactorModule';
import { CheerioAPI } from 'cheerio';

export const getPWAConfig = (modules: ReactorModule[]): ReactorModulePWAConfig | null => {
  let pwa: ReactorModulePWAConfig | null = null;
  for (let module of modules) {
    if (module.config.pwa) {
      pwa = module.config.pwa;
    }
  }
  return pwa;
};

const enum PWA {
  MANIFEST = 'webmanifest.json',
  WORKER_LOADER = 'load-worker.js',
  SERVICE_WORKER = 'service-worker.js'
}

export const applyPWAMiddleware = (config: ReactorModulePWAConfig, app: Application) => {
  app.get(
    `/${PWA.MANIFEST}`,
    express.static(path.dirname(config.manifest), {
      index: path.basename(config.manifest),
      redirect: false
    })
  );

  app.get(
    `/${PWA.WORKER_LOADER}`,
    express.static(path.join(__dirname, '../media'), {
      index: PWA.WORKER_LOADER,
      redirect: false
    })
  );

  app.get(
    `/${PWA.SERVICE_WORKER}`,
    express.static(path.dirname(config.serviceWorker), {
      index: path.basename(config.serviceWorker),
      redirect: false
    })
  );

  _.forEach(config.other, (f, key) => {
    app.get(
      `/${key}`,
      express.static(path.dirname(f), {
        index: path.basename(f),
        redirect: false
      })
    );
  });
};

const readFileCached = _.memoize(async (fileName: string) => {
  return await fs.promises.readFile(fileName, 'utf8');
});

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

export const createMobileMiddleware = (options: { index_file: string }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const mobile_data = await readFileCached(options.index_file);

    if (req.headers['user-agent']) {
      const p = new UAParser(req.headers['user-agent']);
      const type = p.getDevice();
      if (type?.type === 'mobile' || type?.type === 'tablet') {
        res.send(mobile_data);
        res.end();
        return;
      }
    }
    next();
  };
};
