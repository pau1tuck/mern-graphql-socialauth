"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
require("dotenv/config");
const path_1 = tslib_1.__importDefault(require("path"));
const uuid_1 = require("uuid");
const express_1 = tslib_1.__importDefault(require("express"));
const express_session_1 = tslib_1.__importDefault(require("express-session"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_facebook_1 = tslib_1.__importDefault(require("passport-facebook"));
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const database_1 = tslib_1.__importDefault(require("./config/database"));
const user_resolver_1 = require("./resolvers/user.resolver");
const user_entity_1 = require("./entities/user.entity");
const server = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const orm = yield typeorm_1.createConnection(database_1.default);
    const app = express_1.default();
    app.set("trust proxy", 1);
    app.use(express_session_1.default({
        name: "sid",
        genid: (req) => {
            return uuid_1.v4();
        },
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: false,
            sameSite: process.env.NODE_ENV === "production" ? true : "lax",
            secure: process.env.NODE_ENV === "production",
        },
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    const serializeUser = (currentUser) => {
        passport_1.default.serializeUser((user, done) => {
            done(null, {
                userid: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
                roles: currentUser === null || currentUser === void 0 ? void 0 : currentUser.roles,
            });
        });
    };
    passport_1.default.deserializeUser((obj, done) => {
        done(null, false);
    });
    const FacebookStrategy = passport_facebook_1.default.Strategy;
    passport_1.default.use(new FacebookStrategy({
        clientID: String(process.env.FACEBOOK_APP_ID),
        clientSecret: String(process.env.FACEBOOK_APP_SECRET),
        callbackURL: "https://187a787e98b5.ngrok.io/auth/facebook/callback",
    }, (accessToken, refreshToken, profile, cb) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        let matchingUser = yield user_entity_1.User.findOne({
            where: { facebookId: profile.id },
        });
        if (!matchingUser) {
            try {
                user_entity_1.User.insert({
                    facebookId: profile.id,
                    firstName: (_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName,
                    lastName: (_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName,
                    email: (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0].value,
                    verified: true,
                });
            }
            catch (err) {
                console.log(err);
            }
            matchingUser = yield user_entity_1.User.findOne({
                where: { facebookId: profile.id },
            });
        }
        passport_1.default.serializeUser((user, done) => {
            done(null, {
                userid: matchingUser === null || matchingUser === void 0 ? void 0 : matchingUser.id,
                roles: matchingUser === null || matchingUser === void 0 ? void 0 : matchingUser.roles,
            });
        });
        cb(null, matchingUser === null || matchingUser === void 0 ? void 0 : matchingUser.id);
    })));
    const graphQLSchema = yield type_graphql_1.buildSchema({
        resolvers: [user_resolver_1.UserResolver],
        validate: false,
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: graphQLSchema,
        context: ({ req, res }) => ({
            req,
            res,
        }),
        introspection: !!process.env.DEBUG,
        playground: !!process.env.DEBUG,
    });
    apolloServer.applyMiddleware({ app, cors: false });
    if (orm.isConnected) {
        console.log(`Connected to MongoDB`);
    }
    app.get("/auth/facebook", passport_1.default.authenticate("facebook"));
    app.get("/auth/facebook/callback", passport_1.default.authenticate("facebook", {
        failureRedirect: "/fail",
        failureFlash: true,
        failureMessage: true,
    }), (req, res) => {
        console.log(req.session);
        res.redirect("/");
    });
    app.use("/static", express_1.default.static("public/dist"));
    app.get("/", (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "../public/index.html"));
    });
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Node server running on port ${process.env.PORT}`);
    });
});
server().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map