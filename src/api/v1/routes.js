import * as routes from 'routes/v1';
import * as services from 'services';
import { isAuthenticated } from "lib/auth";
 

module.exports = (api, { db, config }) => {

	api.get('/v1', async ({ query, params }, res) => {
         res.status(200).send({ message:"OK", status:200, version:"0.0.1" })     
    });

    api.use('/v1/students', isAuthenticated ,routes.student(new services.StudentServices({ config, db })));
    
    api.use('/v1/classrooms', isAuthenticated , routes.classroom(new services.ClassService({ config, db })));
    
    api.use('/v1/hobbies', isAuthenticated,  routes.hobby(new services.HobbyService({ config, db })));
    
};

