import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/user.model.js"; 
import '../config.js';
import dotenv from "dotenv";
// const result = dotenv.config({ path: './.env' }); 
// console.log("dotenv result:", result);
// console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
// console.log("Callback URL:", process.env.CALLBACK_URL);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL: process.env.CALLBACK_URL
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,

            fullName: profile.displayName,

            email: profile.emails[0].value,

            profilePic: profile.photos[0].value,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize/Deserialize

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});
export default passport;