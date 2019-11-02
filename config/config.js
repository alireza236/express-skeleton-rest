var config = require('config');

const setting = {
  development: {
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    host: config.get('db.host'),
    dialect: config.get('db.dialect'),
    dialectOptions: {},
    logging: console.log
  },
  test: {
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    host: config.get('db.host'),
    dialect: config.get('db.dialect'),
    dialectOptions: {}
  },
  production: {
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    host: config.get('db.host'),
    dialect: config.get('db.dialect'),
    dialectOptions: {}
  },
  staging: {
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    host: config.get('db.host'),
    dialect: config.get('db.dialect'),
    dialectOptions: {}
  }
};

module.exports = setting;
