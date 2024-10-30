import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../mongoose/schemas/user.js";
import { comparePass } from "../util/hashPassword.js";

// Using the local strategy for authenticating users
export default passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("USER NOT FOUND");
      if (!comparePass(password, findUser.password)) throw new Error("INVALID CREDENTIALS");

      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
