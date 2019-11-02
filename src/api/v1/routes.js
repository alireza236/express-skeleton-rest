import * as routes from 'routes/v1';
//import * as services from 'services';
import { isAuthenticated } from "lib/auth";
 

module.exports = (api, { db, config }) => {

	api.get('/v1', async ({ query, params }, res) => {
         res.send({ message:"OK", status:200, version:"0.0.1" })     
    });

    api.use('/v1/users',isAuthenticated,routes.users({config, db}));
    
   
};

