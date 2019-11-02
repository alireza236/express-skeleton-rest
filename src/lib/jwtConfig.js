import config from 'config';
module.exports = {
    secret: config.get('jwt-secret'),
  };
  