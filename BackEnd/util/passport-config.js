import passport from "passport";
import "../strategies/local-strategy.js";
import "../strategies/discord-strategy.js";
import { User } from "../mongoose/schemas/user.js";
import { DiscordUser } from "../mongoose/schemas/discordUser.js";

// Serialize user with a discriminator
passport.serializeUser((user, done) => {
  const userType = user.discordId ? "discord" : "local";
  done(null, { id: userType === "discord" ? user.discordId : user.id, type: userType });
});

// Deserialize based on user type
passport.deserializeUser(async (sessionData, done) => {
  try {
    if (sessionData.type === "local") {
      const user = await User.findById(sessionData.id);
      if (!user) throw new Error("USER NOT FOUND");
      done(null, user);
    } else if (sessionData.type === "discord") {
      const user = await DiscordUser.findOne({ discordId: sessionData.id });
      if (!user) throw new Error("USER NOT FOUND");
      done(null, user);
    }
  } catch (error) {
    done(error, null);
  }
});

export default passport;
