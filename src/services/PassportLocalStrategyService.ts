import passport from "passport";
import passportLocal from "passport-local";
import jwtStrategy from "passport-jwt";
import UserService from "../services/UserService";
import User from "../entity/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Athlete from "../entity/Athlete";
import Trainer from "../entity/Trainer";
import AthleteService from "./AthleteService";
import TrainerService from "./TrainerService";

const userService = new UserService(User);
const athleteServie = new AthleteService(Athlete);
const trainerService = new TrainerService(Trainer);
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;
const BCRYPT_SALT_ROUNDS = 12;

passport.serializeUser(function (user: any, done: any) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done: any) {
  done(null, user);
});

passport.use(
  "login",
  new LocalStrategy(async function (username: any, password: any, done: any) {
    const user: User = await userService.findUserByName(username);
    if (!user) {
      return done(null, false, { message: "No user found" });
    }
    bcrypt.compare(password, user.password).then((response) => {
      if (response !== true) {
        return done(null, false, { message: "password does not match" });
      }
    });

    const token = jwt.sign(
      JSON.stringify({ username: user.username, password: user.password }),
      "secret"
    );
    user.data = JSON.parse(user.data);

    return done(null, { token, user });
  })
);

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      if (!(req.body.type && req.body.dateOfBirth && req.body.email)) {
        return done(null, false, { message: "No full user body" });
      }

      const user = await userService.findUserByName(username);
      if (user) {
        return done(null, false, { message: "username already taken" });
      }
      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

      let newUser = null;

      switch (req.body.type) {
        case "Athlete":
          {
            newUser = new Athlete();
          }
          break;
        case "Coach": {
          newUser = new Trainer();
        }
      }

      newUser.username = username;
      newUser.password = hashedPassword;
      newUser.email = req.body.email;
      newUser.dateOfBirth = req.body.dateOfBirth;
      newUser.data = req.body.data;
      newUser.role = req.body.role;

      let userSaved = null;

      switch (req.body.type) {
        case "Athlete":
          {
            userSaved = await athleteServie.insert(newUser as Athlete);
          }
          break;
        case "Coach": {
          userSaved = await trainerService.insert(newUser as Trainer);
        }
      }

      return done(null, userSaved);
    }
  )
);

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secret",
    },
    async (jwtPayload: any, done: any) => {
      const user: User = await userService.findUserByName(jwtPayload.username);

      if (!user) {
        return done(null, false, { message: "No user found" });
      }
      bcrypt.compare(jwtPayload.password, user.password).then((response) => {
        if (response !== true) {
          return done(null, false, { message: "password does not match" });
        }
      });
      return done(null, { user });
    }
  )
);

export = passport;
