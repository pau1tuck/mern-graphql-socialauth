import passport from "passport";
import passportFacebook from "passport-facebook";
import passportGoogle from "passport-google-oauth20";
import { User } from "../entities/user.entity";
import { IUser } from "../types/user";

const {
    HOST,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
} = process.env;

const FacebookStrategy = passportFacebook.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

export const serializeUser = (matchingUser: IUser) => {
    passport.serializeUser((_, done) => {
        done(null, {
            userId: matchingUser.id,
            roles: matchingUser?.roles,
        });
    });
};

export const passportStrategies = () => {
    /* passport.deserializeUser((_, done) => {
        done(null, false);
    }); */
    passport.use(
        new FacebookStrategy(
            {
                clientID: FACEBOOK_APP_ID,
                clientSecret: FACEBOOK_APP_SECRET,
                callbackURL: `${HOST}/auth/facebook/callback`,
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
                    console.log(`User "${profile.displayName}" registered`);
                    matchingUser = await User.findOne({
                        where: { facebookId: profile.id },
                    });
                }
                if (matchingUser) {
                    serializeUser(matchingUser);
                    console.log(`User "${profile.displayName}" logged in`);
                }
                cb(null, matchingUser?.id);
            }
        )
    );
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: `${HOST}//auth/google/callback`,
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
                    console.log(`User "${profile.displayName}" registered`);
                    matchingUser = await User.findOne({
                        where: { googleId: profile.id },
                    });
                }
                if (matchingUser) {
                    serializeUser(matchingUser);
                    console.log(`User "${profile.displayName}" logged in`);
                }
                cb(null, matchingUser?.id);
            }
        )
    );
};
