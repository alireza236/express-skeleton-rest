import passport from "passport";
import jwt from "jsonwebtoken";
import jwtSecret from "lib/jwtConfig";
import winston from "lib/winston";
import { registerValidationRules, registerValidate } from "validators/registerValidator";
import { loginValidationRules, loginValidate } from "validators/loginValidator";

module.exports = (api, { db, config }) => {

	api.get('/v1', async ({ query, params }, res) => {
         res.send({ message:"OK", status:200, version:"0.0.1" })     
    });

    api.post('/v1/register',registerValidationRules(), registerValidate, async (req,res,next)=>{
        passport.authenticate('register', (err, user, info) => {
            if (err) {
              console.error(err);
            }
            if (info !== undefined) {
              console.error(info.message);
              res.status(403).send(info.message);
            } else {
              // eslint-disable-next-line no-unused-vars
              req.logIn(user, error => {
                winston.log('info',user);
                const data = {
                    name: req.body.name,
                    username: req.body.username,
                    email: req.body.email
                };
                winston.log('info',data);
                
                db.User.findOne({
                    where: {
                        username: data.username,
                    },
                }).then(user => {
                    winston.log('info',user);
                  
                  user
                  .update({
                      name: data.name,
                      username: data.user,
                      email: data.email,
                    })
                    .then(() => {
                        winston.log('info','user created in db');
                      res.status(200).send({ message: 'user created' });
                    });
                });
              });
            }
          })(req, res, next);
    });

    api.post('/v1/login', loginValidationRules(), loginValidate, async (req,res,next)=>{
        passport.authenticate('login', (err, users, info) => {
            if (err) {
              console.error(`error ${err}`);
            }
            if (info !== undefined) {
              console.error(info.message);
              if (info.message === 'bad username') {
                res.status(401).send(info.message);
              } else {
                res.status(403).send(info.message);
              }
            } else {
              req.logIn(users, () => {
                db.User.findOne({
                  where: {
                    username: req.body.username,
                  },
                }).then(user => {
                  const token = jwt.sign({ id: user.id }, jwtSecret.secret, {
                    expiresIn: 60 * 60,
                  });
                  res.status(200).send({
                    auth: true,
                    token,
                    message: 'user found & logged in',
                  });
                });
              });
            }
          })(req, res, next);
    })
};

