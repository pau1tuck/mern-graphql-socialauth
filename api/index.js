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
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const passport_2 = require("./config/passport");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const user_resolver_1 = require("./resolvers/user.resolver");
const server = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const orm = yield typeorm_1.createConnection(database_1.mongodb);
    const app = express_1.default();
    app.set("trust proxy", 1);
    app.use(express_session_1.default({
        name: "sid",
        genid: () => uuid_1.v4(),
        store: new redis_1.RedisStore({
            client: redis_1.redisClient,
            disableTouch: true,
            disableTTL: true,
        }),
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
    passport_1.default.deserializeUser((obj, done) => {
        done(null, false);
    });
    passport_2.passportStrategies();
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
        console.log(`Connected to remote MongoDB`);
    }
    redis_1.redisClient.monitor((error, monitor) => {
        if (!error) {
            console.log(`Connected to Redis on port ${process.env.REDIS_PORT}`);
        }
        if (process.env.DEBUG) {
            monitor.on("monitor", (time, args, source) => {
                console.log(time, args, source);
            });
        }
    });
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