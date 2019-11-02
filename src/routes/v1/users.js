import resource from "lib/resource-router-middleware";
import user from "../../service/UserService";

module.exports = ({ config, db }) => resource({

	mergeParams: true,

	/** Property name to store preloaded entity on `request`. */
	id : 'object',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		let user = user.find( user => user.id===id ),
			err = user ? null : 'Not found';
		callback(err, user);
	},

	/** GET / - List all entities */
	async index({ params }, res) {
		res.json(user);
	},

	/** POST / - Create a new entity */
	async create({ body }, res) {
		body.id = user.length.toString(36);
		user.push(body);
		res.json(body);
	},

	/** GET /:id - Return a given entity */
	async read({ user }, res) {
		res.json(user);
	},

	/** PUT /:id - Update a given entity */
	async update({ user, body }, res) {
		for (let key in body) {
			if (key!=='id') {
				user[key] = body[key];
			}
		}
		res.sendStatus(204);
	},

	/** DELETE /:id - Delete a given entity */
	delete({ user }, res) {
		user.splice(user.indexOf(user), 1);
		res.sendStatus(204);
	}
});
