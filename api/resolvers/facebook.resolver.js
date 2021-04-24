"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const uuid_1 = require("uuid");
const user_entity_1 = require("../entities/user.entity");
const facebookCallback = (accessToken, refreshToken, profile, done) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const matchingUser = user_entity_1.User.findOne({ where: { facebookId: profile.id } });
    if (matchingUser) {
        done(null, matchingUser);
        return;
    }
    const newUser = {
        id: () => uuid_1.v4(),
        facebookId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        country: profile.name.country,
        email: profile.emails && profile.emails[0] && profile.emails[0].value,
    };
    users.push(newUser);
    done(null, newUser);
});
//# sourceMappingURL=facebook.resolver.js.map