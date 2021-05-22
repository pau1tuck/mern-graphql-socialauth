"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
require("dotenv/config");
const uuid_1 = require("uuid");
const express_1 = tslib_1.__importDefault(require("express"));
const express_session_1 = tslib_1.__importDefault(require("express-session"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const passport_config_1 = require("./config/passport.config");
const database_config_1 = tslib_1.__importDefault(require("./config/database.config"));
const redis_config_1 = require("./config/redis.config");
const check_auth_1 = tslib_1.__importDefault(require("./utils/check-auth"));
const user_resolver_1 = require("./resolvers/user.resolver");
const routes_1 = tslib_1.__importDefault(require("./routes"));
const { NODE_ENV, DEBUG, PORT, REDIS_PORT, SESSION_SECRET } = process.env;
const server = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const orm = yield typeorm_1.createConnection(database_config_1.default);
    const app = express_1.default();
    app.set("trust proxy", 1);
    app.use(express_session_1.default({
        name: "sid",
        genid: () => uuid_1.v4(),
        store: new redis_config_1.RedisStore({
            client: redis_config_1.redisClient,
            disableTouch: true,
            disableTTL: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: false,
            sameSite: NODE_ENV === "production" ? true : "lax",
            secure: NODE_ENV === "production",
        },
        secret: SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.deserializeUser((_, done) => {
        done(null, false);
    });
    passport_config_1.passportStrategies();
    const graphQLSchema = yield type_graphql_1.buildSchema({
        resolvers: [user_resolver_1.UserResolver],
        validate: false,
        authChecker: check_auth_1.default,
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: graphQLSchema,
        context: ({ req, res }) => ({
            req,
            res,
        }),
        introspection: Boolean(DEBUG),
        playground: Boolean(DEBUG),
    });
    apolloServer.applyMiddleware({ app, cors: false });
    if (orm.isConnected) {
        console.log(`Connected to remote database`);
    }
    redis_config_1.redisClient.monitor((error, monitor) => {
        if (!error) {
            console.log(`Connected to Redis on port ${REDIS_PORT}`);
        }
        if (DEBUG) {
            monitor.on("monitor", (time, args, source) => {
                console.log(time, args, source);
            });
        }
    });
    app.use("/", routes_1.default);
    console.log(passport_1.default);
    app.listen(PORT, () => {
        console.log(`🚀 Node server running on port ${PORT}`);
    });
});
server().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=server.js.map