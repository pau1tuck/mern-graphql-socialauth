"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportStrategies = exports.serializeUser = void 0;
const tslib_1 = require("tslib");
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_facebook_1 = tslib_1.__importDefault(require("passport-facebook"));
const passport_google_oauth20_1 = tslib_1.__importDefault(require("passport-google-oauth20"));
const user_entity_1 = require("../entities/user.entity");
const { HOST, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, } = process.env;
const FacebookStrategy = passport_facebook_1.default.Strategy;
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
const serializeUser = (matchingUser) => {
    passport_1.default.serializeUser((_, done) => {
        done(null, {
            userId: matchingUser.id,
            roles: matchingUser === null || matchingUser === void 0 ? void 0 : matchingUser.roles,
        });
    });
};
exports.serializeUser = serializeUser;
const passportStrategies = () => {
    passport_1.default.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: `${HOST}/auth/facebook/callback`,
    }, (accessToken, refreshToken, profile, cb) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        let matchingUser = yield user_entity_1.User.findOne({
            where: { facebookId: profile.id },
        });
        if (!matchingUser) {
            try {
                user_entity_1.User.insert({
                    facebookId: profile.id,
                    givenName: ((_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName) || profile.displayName,
                    familyName: (_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName,
                    email: (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0].value,
                    verified: true,
                });
            }
            catch (err) {
                cb(err, null);
            }
            matchingUser = yield user_entity_1.User.findOne({
                where: { facebookId: profile.id },
            });
        }
        if (matchingUser) {
            exports.serializeUser(matchingUser);
        }
        cb(null, matchingUser === null || matchingUser === void 0 ? void 0 : matchingUser.id);
    })));
    passport_1.default.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${HOST}//auth/google/callback`,
    }, (accessToken, refreshToken, profile, cb) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f;
        let matchingUser = yield user_entity_1.User.findOne({
            where: { googleId: profile.id },
        });
        if (!matchingUser) {
            try {
                user_entity_1.User.insert({
                    googleId: profile.id,
                    givenName: (_d = profile.name) === null || _d === void 0 ? void 0 : _d.givenName,
                    familyName: (_e = profile.name) === null || _e === void 0 ? void 0 : _e.familyName,
                    email: (_f = profile.emails) === null || _f === void 0 ? void 0 : _f[0].value,
                    verified: true,
                });
            }
            catch (err) {
                cb(err, {});
            }
            matchingUser = yield user_entity_1.User.findOne({
                where: { googleId: profile.id },
            });
        }
        if (matchingUser) {
            exports.serializeUser(matchingUser);
        }
        cb(null, matchingUser === null || matchingUser === void 0 ? void 0 : matchingUser.id);
    })));
};
exports.passportStrategies = passportStrategies;
//# sourceMappingURL=passport.config.js.map