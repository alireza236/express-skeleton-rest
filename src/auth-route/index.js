import { Router } from 'express';


export default ({config, db }) => {
  let api = Router();
  require("./routes")(api, { config, db });
  return api;
};