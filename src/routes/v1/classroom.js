import resource from 'lib/resource-router-middleware';
import _ from 'lodash';
import { responseErr } from 'lib/utils';

module.exports = (ClassRoom) => resource({

  mergeParams: true,

  /** Property name to store preloaded entity on `request`. */
  id: 'object',

  /** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
  load({query,params}, id, callback) {

    const option = _.merge(query, params);

    return ClassRoom.find(id, option)
      .then(object => callback(null, object))
      .catch(err => {
        callback(err);
      });
  },

  /** GET / - List all entities */
  async index({ user, query, params, payloads }, res) {
    try {
      //merge query & params
      let response = await ClassRoom.findAll({
        user,
        params: _.merge(query, params),
        payloads
      });
      res.json(response);

    } catch (e) {
      responseErr(res, e);
    }

  },

  /** GET /:id - Return a given entity */
  async read({ object }, res) {
    // eslint-disable-next-line no-useless-catch
    try {
      let response = {
        data: object
      };
      //set destroy redis in 1 hour
      // redis
      // .setexAsync(isbn, 3600, JSON.stringify(response))
      // .catch(err => winston.log('info', err, 'SETEX ERROR'));
      //response status 200
      res.json(response);
    } catch (e) {
      throw e;
    }
  },

  /** POST / - Create a new entity */
  async create({ user, body, params, payloads }, res) {
    try {
      let response = await ClassRoom.create({
        user,
        params: _.merge(body, params),
        payloads
      });
      res.status(201).json({
        data: response
      });
    } catch (e) {
      responseErr(res, e);
    }

  },

  /** PUT /:id - Update a given entity */
  async update({ user, body, object, payloads }, res) {
    try {
      await ClassRoom.update({
        object,
        params: body,
        payloads
      });
      res.status(204).send();
    } catch (e) {
      responseErr(res, e);
    }
  },

  /** DELETE /:id - Delete a given entity */
  async delete({ user ,object }, res) {

    try {
      await ClassRoom.remove({
        user,
        object
      });
      res.status(204).send();
    } catch (e) {
      responseErr(res, e);
    }
  }

});