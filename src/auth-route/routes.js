import passport from "passport";
import jwt from "jsonwebtoken";
import jwtSecret from "lib/jwtConfig";
import winston from "lib/winston";
import { registerValidationRules, registerValidate } from "validators/registerValidator";
import { loginValidationRules, loginValidate } from "validators/loginValidator";

module.exports = (api, { db, config }) => {

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

    api.get('/v1/resetPassword', (req, res) => {
      db.User.findOne({
        where: {
          resetPasswordToken: req.query.resetPasswordToken,
          resetPasswordExpires: {
            [Op.gt]: Date.now(),
          },
        },
      }).then((user) => {
        if (user == null) {
          console.error('password reset link is invalid or has expired');
          res.status(403).send('password reset link is invalid or has expired');
        } else {
          res.status(200).send({
            username: user.username,
            message: 'password reset link a-ok',
          });
        }
      });
    });

    api.put('/v1/updatePassword', (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
          console.error(err);
        }
        if (info !== undefined) {
          console.error(info.message);
          res.status(403).send(info.message);
        } else {
          db.User.findOne({
            where: {
              username: req.body.username,
            },
          }).then((userInfo) => {
            if (userInfo != null) {
              console.log('user found in db');
              bcrypt
                .hash(req.body.password, BCRYPT_SALT_ROUNDS)
                .then((hashedPassword) => {
                  userInfo.update({
                    password: hashedPassword,
                  });
                })
                .then(() => {
                  console.log('password updated');
                  res
                    .status(200)
                    .send({ auth: true, message: 'password updated' });
                });
            } else {
              console.error('no user exists in db to update');
              res.status(404).json('no user exists in db to update');
            }
          });
        }
      })(req, res, next);
    });

    api.get('/v1/findMe', (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
          console.log(err);
        }
        if (info !== undefined) {
          winston.log('info',  info.message);
          res.status(401).send(info.message);
        } else if (user.username === req.query.username) {
          db.User.findOne({
            where: {
              username: req.query.username,
            },
          }).then((userInfo) => {
            if (userInfo != null) {
              winston.log('info',  "user found in db from findUsers");
              winston.log('info',  userInfo);
              res.status(200).json({
                auth: true,
                name:userInfo.name, 
                email: userInfo.email,
                username: userInfo.username,
              });
            } else {
              winston.log('error', "no user exists in db with that username");
              res.status(401).send('no user exists in db with that username');
            }
          });
        } else {
          winston.log('error', "jwt id and username do not match");
          res.status(403).send('username and jwt token do not match');
        }
      })(req, res, next);
    });
};

