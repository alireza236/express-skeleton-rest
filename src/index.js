import { addPath } from 'app-module-path';
// add better locale require, based on
// https://gist.github.com/branneman/8048520
addPath(__dirname);

import "app-module-path/register";
import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import config  from "config";
import passport from "passport";
import parseError from "parse-error";
import compression from "compression";
import helmet from "helmet";
import bodyParser from "body-parser"
import HTTPError from "node-http-error";
import winston from "lib/winston";
import auth from "lib/auth";
import middleware from "./middleware";
import api from "api";
import authRoute from "auth-route";
import { db as initializeDb } from "./config";

import "dotenv"
let app = express();
app.server = http.createServer(app);
  // logger
  app.use(morgan('combined'));

  app.use(cors({exposedHeaders: config.get('corsHeaders')}));

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: true}));
  
  // parse application/json
  app.use(bodyParser.json({
	type: 'application/json',
	limit : config.get('bodyLimit')
  }));
  
  //passport initialize
  app.use(passport.initialize()); 
  //app.use(helmet()); 
  //app.use(compression()); 
  
 
// connect to db
initializeDb(config, (err,db) => {
	
	console.log('Error:',err)
	if (err) {
		return winston.log('info', `Failed Connect to db ${err}`);
	}

	auth({config, db})
	
	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api',api({ config, db }));
	
	app.use('/api',authRoute({ config, db }));
	

	app.use ('*', (req, res, next) => {
		 res.status(404).json({
		  status: 404,
		  message: 'Resource Not Found'
		}); 
       return next();  
	});
	

	  app.use((err, req, res, next) => {
		winston.log('error',  err.message);
		 
		// if (err instanceof IpDeniedError) {
		//   res.status(401).json({ status: 401, message: 'Unauthorized'});
		// }
		// else {
		res.status(500).json({status:500, message: 'internal error', type:'internal'});
		// }
		//do logging and user-friendly error message display
		return next(new HTTPError(500));
	  });
	
	  if (!module.parent) {
		app.server.listen(process.env.PORT || config.get('port'));
		winston.log('info',`Started ${config.get('env')} on port ${config.get('port')}`);
	  }
 
	});

export default app;

process.on('unhandledRejection', error => {
    console.error('Uncaught Error', parseError(error));
});
