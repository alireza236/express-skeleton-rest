const Router = require('express').Router;
const winston = require('lib/winston');

const keyed = ['get', 'read', 'put', 'update', 'patch', 'modify', 'del', 'delete'],
  map = {
    index: 'get',
    list: 'get',
    read: 'get',
    create: 'post',
    update: 'put',
    modify: 'patch'
  };

module.exports = (route) => {
  route.mergeParams = route.mergeParams ? true : false;
  let router = Router({
      mergeParams: route.mergeParams
    }),
    key, fn, url;

  if (route.middleware) router.use(route.middleware);

  if (route.load) {
    router.param(route.id, (req, res, next, id) => {
      route.load(req, id, (err, data) => {
        if (err) {
          winston.log('info', err, 'ERROR_LOAD_ROUTES');
          return res.status(500).json({
            status: 500,
            message: 'internal error',
            type: 'internal'
          });
        }
        if (!data) return res.status(404).json({
          status: 404,
          message: 'Resource Not Found'
        });
        req[route.id] = data;
        next();
      });
    });
  }

  for (key in route) {
    fn = map[key] || key;
    if (typeof router[fn] === 'function') {
      url = ~keyed.indexOf(key) ? ('/:' + route.id) : '/';
      router[fn](url, route[key]);
    }
  }

  return router;
};

module.exports.keyed = keyed;