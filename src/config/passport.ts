import passport from "passport";
import passportFacebook from "passport-facebook";
import passportGoogle from "passport-google-oauth20";
import { User } from "../entities/user.entity";
import { IUser } from "./types";

const FacebookStrategy = passportFacebook.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

const serializeUser = (matchingUser: IUser | undefined) => {
    passport.serializeUser((_, done) => {
        done(null, {
            userId: matchingUser?.id,
            roles: matchingUser?.roles,
        });
    });
};

export const passportStrategies = () => {
    passport.use(
        new FacebookStrategy(
            {
                clientID: String(process.env.FACEBOOK_APP_ID),
                clientSecret: String(process.env.FACEBOOK_APP_SECRET),
                callbackURL:
                    "https://01fbfe75c1f6.ngrok.io/auth/facebook/callback",
            },
            async (accessToken, refreshToken, profile, cb) => {
                let matchingUser = await User.findOne({
                    where: { facebookId: profile.id },
                });
                if (!matchingUser) {
                    try {
                        User.insert({
                            facebookId: profile.id,
                            givenName:
                                profile.name?.givenName || profile.displayName,
                            familyName: profile.name?.familyName,
                            email: profile.emails?.[0].value,
                            verified: true,
                        });
                    } catch (err) {
                        cb(err, null);
                    }
                    matchingUser = await User.findOne({
                        where: { facebookId: profile.id },
                    });
                }
                serializeUser(matchingUser);
                cb(null, matchingUser?.id);
            }
        )
    );
    passport.use(
        new GoogleStrategy(
            {
                clientID: String(process.env.GOOGLE_CLIENT_ID),
                clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
                callbackURL: "http://www.example.com/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, cb) => {
                let matchingUser = await User.findOne({
                    where: { googleId: profile.id },
                });
                if (!matchingUser) {
                    try {
                        User.insert({
                            googleId: profile.id,
                            givenName: profile.name?.givenName,
                            familyName: profile.name?.familyName,
                            email: profile.emails?.[0].value,
                            verified: true,
                        });
                    } catch (err) {
                        cb(err, {});
                    }
                    matchingUser = await User.findOne({
                        where: { googleId: profile.id },
                    });
                }
                serializeUser(matchingUser);
                cb(null, matchingUser?.id);
            }
        )
    );
};
