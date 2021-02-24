
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
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    async (req, username, password, done) => {
      //console.log('info',`Username: ${username}`);
      //console.log('info',`Username: ${req.body.firstname}`);

      const { firstname, lastname, email } = req.body;

      try {
         db.User.findOne({
          where:{
             email: username
          }
        }).then(user => {
          if (user) {
            winston.log('error', 'email already taken');
            return done(null, false, {
              message: 'email already taken',
            });
          }
          bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
            db.User.create({
              firstname,
              lastname,
              email,
              password: hashedPassword,
            }).then(user => {
              winston.log('info', 'user created:');
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
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (username, password, done) => {
      try {
         db.User.findOne({
          where: {
            email: username,
          },
        }).then(user => {
          if (user === null) {
            return done(null, false, { message: "error_login" });
          }

          bcrypt.compare(password, user.password).then(response => {
            if (response !== true) {
              winston.log('error',  'passwords do not match');
              return done(null, false, { message: "passwords_do_not_match" });
            }
            return done(null, user, { message: "success_login"});
            //console.log('USER ON LOGIN', JSON.stringify(user, null,2));
          });
        });
      } catch (err) {
        done(err);
      }
    },
  ),
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('Bearer'),
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
          console.log('USER HAS LOGGEDIN', JSON.stringify(user, null,2));
          
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