import passportJwt from "passport-jwt";
import passport from "passport";
import { User } from "../schemas/user.js";
import "dotenv/config";

const secret = process.env.SECRET;
const ExtractJWT = passportJwt.ExtractJwt;
const Strategy = passportJwt.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, function (payload, done) {
    User.find({ _id: payload.id })
      .then(([user]) => {
        if (!user) {
          return done(new Error("User not found"));
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  })
);
