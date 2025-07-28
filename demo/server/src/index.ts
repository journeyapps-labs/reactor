import compression from 'compression';
import express from 'express';
import * as http from 'http';
import {
  createBaseIndexMiddleware,
  createModuleLoaderContentTransformer,
  loadModules,
  serveModules
} from '@journeyapps-labs/lib-reactor-server';
import { join } from 'path';

const app = express();
const server = http.createServer(app);

let path = require.resolve('@journeyapps-labs/lib-reactor-server');

const modules = loadModules({
  env: {
    MODULES: process.env.MODULES.split(',')
  }
});

app.use(compression());

const serveIndex = () => {
  return createBaseIndexMiddleware({
    title: 'Demo',
    getEnv: () => {
      return {
        USER_ID: '1234',
        USER_NAME: 'Test User',
        USER_EMAIL: 'test@example.com'
      };
    },
    domTransform: ($) => {
      createModuleLoaderContentTransformer($, modules);
    },
    templateVars: {
      LOADER_BACKGROUND_COLOR: '#1d1d1d'
    },
    indexFile: join(path, '../../media/index.html')
  });
};

(async () => {
  const serveIndexMiddleware = await serveIndex();

  // !====================== Frontend routes for serving reactor ide webapp ================
  serveModules({
    modules: modules,
    app: app
  });
  app.get('/', serveIndexMiddleware as any);

  server.listen(parseInt(process.env.PORT), () => {
    console.info(`server listening on port ${process.env.PORT}`);
  });
})().catch((err) => {
  console.error('something went wrong booting system', err);
  process.exit(1);
});
