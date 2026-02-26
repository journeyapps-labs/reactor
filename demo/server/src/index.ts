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

const PORT = parseInt(process.env.PORT || '9527');
const MODULES = loadModules({
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
      createModuleLoaderContentTransformer($, MODULES);
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
    modules: MODULES,
    app: app
  });
  app.get('/', serveIndexMiddleware as any);

  server.listen(PORT, () => {
    console.info(`server listening on port ${PORT}`);
  });
})().catch((err) => {
  console.error('something went wrong booting system', err);
  process.exit(1);
});
