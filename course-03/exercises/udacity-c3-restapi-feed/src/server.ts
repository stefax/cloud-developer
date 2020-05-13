import express from 'express';
import { sequelize } from './util/sequelize';
import { V0IndexRouter } from './controllers/v0/index.router';
import bodyParser from 'body-parser';
import { config } from './config/config';
import { V0MODELS } from './controllers/v0/model.index';
import * as HttpStatus from 'http-status-codes';

const c = config.server;

(async () => {
  await sequelize.addModels(V0MODELS);
  await sequelize.sync();

  const app = express();
  const port = c.port || c.default_port;

  app.use(bodyParser.json());

  // @TODO: CORS Should be restricted
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use(`/api/${config.version}/`, V0IndexRouter);

  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.status(HttpStatus.OK).send(`Use e.g. http://${c.host}:${c.port}/api/${config.version}/feed`);
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running on ${c.host}:${c.port}`);
      console.log( `press CTRL+C to stop server` );
  } );
})();
