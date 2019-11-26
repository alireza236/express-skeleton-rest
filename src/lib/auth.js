
import bcrypt from "bcrypt";
import Sequelize from "sequelize";
import jwtSecret from "./jwtConfig";
import winston from "lib/winston";

 
const BCRYPT_SALT_ROUNDS = 12;
const Op = Sequelize.Op;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

export default ({ config, db }) => {
  passport.use('register',new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    async (req, username, password, done) => {
      console.log(username);
      winston.log('info',`Username: ${username}`);
      winston.log('info',`Username: ${req.body.email}`);

      try {
         db.User.findOne({
          where: {
            [Op.or]: [
              {
                username,
              },
              { email: req.body.email },
            ],
          },
        }).then(user => {
          if (user != null) {
            winston.log('error',  'username or email already taken');
            return done(null, false, {
              message: 'username or email already taken',
            });
          }
          bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
            db.User.create({
              username,
              password: hashedPassword,
              name: req.body.name,
              email: req.body.email
            }).then(user => {
              winston.log('info', `user created:',${user}`);
              return done(null, user);
            });
          });
        });
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use('login', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    async (username, password, done) => {
      try {
         db.User.findOne({
          where: {
            username,
          },
        }).then(user => {
          if (user === null) {
            return done(null, false, { message: 'bad username' });
          }
          bcrypt.compare(password, user.password).then(response => {
            if (response !== true) {
              winston.log('error',  'passwords do not match');
              return done(null, false, { message: 'passwords do not match' });
            }
            winston.log('info', 'user found & authenticated');
            return done(null, user);
          });
        });
      } catch (err) {
        done(err);
      }
    },
  ),
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret.secret,
};

passport.use('jwt', new JWTstrategy(opts, (jwt_payload, done) => {
    try {
       db.User.findOne({
        where: {
          id: jwt_payload.id,
        },
      }).then(user => {
        if (user) {
          winston.log('info',  'user found in db in passport');
          done(null, user);
        } else {
          winston.log('error',  'user not found in db');
          done(null, false);
        }
      });
    } catch (err) {
      done(err);
    }
  }),
);
}
  
 

export const isAuthenticated = passport.authenticate('jwt', { session:false} );
export const isAuthLogin = passport.authenticate('login',{session:false});
export const isAuthRegister = passport.authenticate('register',{session:false});