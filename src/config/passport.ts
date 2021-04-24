import passport from "passport";
import passportFacebook from "passport-facebook";
import { User } from "../entities/user.entity";

const FacebookStrategy = passportFacebook.Strategy;

export const passportStrategies = () => {
    passport.use(
        new FacebookStrategy(
            {
                clientID: String(process.env.FACEBOOK_APP_ID),
                clientSecret: String(process.env.FACEBOOK_APP_SECRET),
                callbackURL:
                    "https://e4577d01c7a5.ngrok.io/auth/facebook/callback",
            },
            async (accessToken, refreshToken, profile, cb) => {
                let matchingUser = await User.findOne({
                    where: { facebookId: profile.id },
                });
                if (!matchingUser) {
                    try {
                        User.insert({
                            facebookId: profile.id,
                            givenName: profile.displayName,
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
                passport.serializeUser((user, done) => {
                    done(null, {
                        userId: matchingUser?.id,
                        roles: matchingUser?.roles,
                    });
                });
                cb(null, matchingUser?.id);
            }
        )
    );
};
