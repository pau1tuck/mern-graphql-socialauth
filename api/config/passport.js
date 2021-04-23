"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookOptions = void 0;
exports.facebookOptions = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ["id", "email", "first_name", "last_name", "country"],
};
//# sourceMappingURL=passport.js.map