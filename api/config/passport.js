"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportStrategies = void 0;
const tslib_1 = require("tslib");
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_facebook_1 = tslib_1.__importDefault(require("passport-facebook"));
const user_entity_1 = require("../entities/user.entity");
const FacebookStrategy = passport_facebook_1.default.Strategy;
const passportStrategies = () => {
    passport_1.default.use(new FacebookStrategy({
        clientID: String(process.env.FACEBOOK_APP_ID),
        clientSecret: String(process.env.FACEBOOK_APP_SECRET),
        callbackURL: "https://e4577d01c7a5.ngrok.io/auth/facebook/callback",
    }, (accessToken, refreshToken, profile, cb) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let matchingUser = yield user_entity_1.User.findOne({
            where: { facebookId: profile.id },
        });
        if (!matchingUser) {
            try {
                user_entity_1.User.insert({
                    facebookId: profile.id,
                    givenName: profile.displayName,
                    familyName: (_a = profile.name) === null || _a === void 0 ? void 0 : _a.familyName,
                    email: (_b = profile.emails) === null || _b === void 0 ? void 0 : _b[0].value,
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
        passport_1.default.serializeUser((user, done) => {
            done(null, {
                userId: matchingUser === null || matchingUser === void 0 ? void 0 : matchingUser.id,
                roles: matchingUser === null || matchingUser === void 0 ? void 0 : matchingUser.roles,
            });
        });
        cb(null, matchingUser === null || matchingUser === void 0 ? void 0 : matchingUser.id);
    })));
};
exports.passportStrategies = passportStrategies;
//# sourceMappingURL=passport.js.map