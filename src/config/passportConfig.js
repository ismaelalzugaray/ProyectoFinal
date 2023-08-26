import passport from "passport";
import passportLocal from "passport-local";
import userModel from "../services/mongoDB/models/usersModel.js";
import jwtStrategy from "passport-jwt";
import config from "./config.js";
import userDTO from "../services/dto/userDTO.js";
import { createHash } from "../../utils.js";

const localStrategy = passportLocal.Strategy;
const jsonwtStrategy = jwtStrategy.Strategy;
const extractJwt = jwtStrategy.ExtractJwt;

const initilizePassport = () => {
  //LOGIN CON JWT
  passport.use(
    "jwt",
    new jsonwtStrategy(
      // extraer la  cookie
      {
        jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.privateKey,
      },

      // Ambiente Async
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          req.logger.error(error);
          return done(error);
        }
      }
    )
  );

  //REGISTRO
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },

      async (req, userName, password, done) => {
        const email = req.body.email;
        try {
          const exist = await userModel.findOne({ email });

          if (exist) {
            return done(null, false);
          }

          let newUser = new userDTO(req.body);
          newUser.password = createHash(req.body.password);
          let date = new Date().toLocaleString();
          newUser.lastConnection = date

          const response = await userModel.create(newUser);
          return done(null, response);
        } catch (error) {
          return done("Error al registrar el usuario" + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      req.logger.error("error deserealizando el usuario" + error);
    }
  });
};

//Extraemos el token de la cookie
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwtToken"];
  }
  return token;
};

export default initilizePassport;
