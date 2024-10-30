import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discordUser.js";

export default passport.use(
  new DiscordStrategy(
    {
      clientID: "1300803801116053585",
      clientSecret: "49dGIGF99rEXDhgi7fZEpf8i5Gafjfmb",
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ["identify"],
    },
    async (acessToken, refreshToken, profile, done) => {
      const findUser = await DiscordUser.findOne({ discordId: profile.id });
      try {
        if (findUser) {
          return done(null, findUser);
        }
        if (!findUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
          });
          const newUserSaved = await newUser.save();
          return done(null, newUserSaved);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);
