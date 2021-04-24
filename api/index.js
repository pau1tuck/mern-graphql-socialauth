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
const type_graphql_1 = require("type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
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
            console.log(req.sessionID);
            return uuid_1.v4();
        },
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? true : "lax",
            secure: process.env.NODE_ENV === "production",
        },
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
    }));
    passport_1.default.session();
    passport_1.default.serializeUser((user, done) => {
        done(null, user);
    });
    const FacebookStrategy = passport_facebook_1.default.Strategy;
    passport_1.default.use(new FacebookStrategy({
        clientID: String(process.env.FACEBOOK_APP_ID),
        clientSecret: String(process.env.FACEBOOK_APP_SECRET),
        callbackURL: "https://3f6026033a33.ngrok.io/auth/facebook/callback",
    }, (accessToken, refreshToken, profile, cb) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        console.log(`Profile: ${profile.id}`);
        const user = yield user_entity_1.User.findOne({
            where: { facebookId: profile.id },
        });
        if (user) {
            cb(null, user);
        }
        else {
            console.log("User does not exist.");
        }
    })));
    app.use(passport_1.default.initialize());
    console.log(app);
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
        failureRedirect: "/",
        failureFlash: true,
    }), (req, res) => {
        console.log(req.session);
        res.redirect("/");
    });
    app.use("/static", express_1.default.static("public/dist"));
    app.get("/", (req, res) => {
        console.log(req.sessionID);
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