import compression from 'compression';
import express from 'express';
import * as http from 'http';
import {
  createBaseIndexMiddleware,
  createModuleLoaderContentTransformer,
  loadModules,
  reactorServerLogger,
  serveModules
} from '@journeyapps-labs/lib-reactor-server';
import { join } from 'path';
import { Log } from '@journeyapps-labs/common-logger';

const app = express();
const server = http.createServer(app);
const logger = reactorServerLogger.childLogger('Demo');

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
    logger.info(Log.green('Listening'), 'on port', Log.bold(Log.cyan(PORT)));
  });
})().catch((err) => {
  logger.error('Failed to boot demo server', err);
  process.exit(1);
});
