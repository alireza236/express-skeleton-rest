
import _ from 'lodash';
/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
    *			collection.find({}, toRes(res));
    *		}
    */
   export function toRes(res, status=200) {
       return (err, thing) => {
           if (err) return res.status(500).send(err);
   
           if (thing && typeof thing.toObject==='function') {
               thing = thing.toObject();
           }
           res.status(status).json(thing);
       };
   }
   export function dd (object) {
    return JSON.stringify(object.body, null, 4);
  }
  
  export function responseErr (res, err) {
    console.log(err);
    switch (err.status) {
      case 400:
        res.status(err.status).json({
          status: err.status,
          message: err.message,
          error: err.typeError
        });
        break;
      default:
        res.status(500).json({status:500, message: 'internal error', type:'internal'});
        break;
    }
  }
  
  export function isJsonString (str) {
    try {
      JSON.parse(str);
    }
    catch (e) {
      return false;
    }
    return true;
  }
  
  export function isset (object) {
    return (!_.isUndefined(object)) ? true : false;
  }
  
  export function isInt (value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
  }
  
  export function resourceNotFound (res, message = 'Resource Not Found') {
    res.status(404).json({
      status: 404,
      message: message
    });
  }
  
  export function resInternalError (res) {
    res.status(500).json({
      status: 500,
      message: 'Internal Error'
    });
  }
  
  export function uid (len) {
    let buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;
  
    for (let i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
  
    return buf.join('');
  }
  
  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  export function responseRedactor (collection, options = { limit: 0 ,offset: 0}, metas = {}) {
    return {
      metas,
      totalCount: collection.count || 0,
      totalPages: (collection.count > options.limit) ? Math.ceil(collection.count/options.limit) : 1,
      cursor: {
        offset: (collection.rows.length == options.limit) ? options.offset + options.limit : 0,
        limit: options.limit
      },
      data: collection.rows || []
    };
  }
  