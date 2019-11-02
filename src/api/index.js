import { version } from '../../package.json';
import { Router } from 'express';


export default ({config, db }) => {
  let api = Router();
  require('api/v1/routes')(api, { config, db });
  return api;
};