import "@babel/polyfill";
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import winston from '../lib/winston';
import _,{omit} from 'lodash';

require('sequelize-hierarchy')(Sequelize);
 

module.exports = (config, callback) => {
  // connect to a database if needed, then pass it to `callback`
  let basename = path.basename(module.filename);
  let db = {};
  let pathModel = `${__dirname}/../models`;
  let setting = {
    host: config.get('db.host'),
    dialect: config.get('db.dialect'),
    port: config.get('db.port'),
    logging: false,
  };

  if (config.get('env') == 'development') {
    setting.logging = false;
  }

  if (config.get('env') == 'production') {
    setting.pool = config.get('db.pool');
    setting.replication = config.get('db.replication');
    setting = omit(setting, ['host']);
  }

  const sequelize = new Sequelize(config.get('db.database'), config.get('db.username'), config.get('db.password'), setting);
  // you can use the authenticate function like this to test the connection.
  sequelize
    .authenticate()
    .then(() => {
      winston.log('info', 'connection db has been established successfully');
      fs
        .readdirSync(pathModel)
        .filter(file => {
          return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
          var model = sequelize['import'](path.join(pathModel, file));
          db[model.name] = model;
        });

      Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
          db[modelName].associate(db);
        }
      });
      db.sequelize = sequelize;
      db.Sequelize = Sequelize;

      callback(null, db);
    })
    .catch(err => {
      winston.log('error', `unable to connect to the database callback throw error ${err.message}`);
      callback(err);
    });

};