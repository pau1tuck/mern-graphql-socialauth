import "reflect-metadata";
import "dotenv/config";
import path from "path";
import { v4 } from "uuid";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { createConnection, Connection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { passportStrategies } from "./config/passport.config";
import database from "./config/database.config";
import { RedisStore, redisClient } from "./config/redis.config";
import authChecker from "./utils/check-auth";
import { UserResolver } from "./resolvers/user.resolver";
import routes from "./routes";

const { NODE_ENV, DEBUG, PORT, REDIS_PORT, SESSION_SECRET } = process.env;

const server = async () => {
    const orm: Connection = await createConnection(database);

    const app: Express = express();

    app.set("trust proxy", 1);

    app.use(
        session({
            name: "sid",
            genid: () => v4(),
            store: new RedisStore({
                client: redisClient as any,
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
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.deserializeUser((_, done) => {
        done(null, false);
    });

    passportStrategies();

    const graphQLSchema = await buildSchema({
        resolvers: [UserResolver],
        validate: false,
        authChecker,
    });

    const apolloServer = new ApolloServer({
        schema: graphQLSchema,
        context: ({ req, res }: Request & Response) => ({
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

    redisClient.monitor((error, monitor) => {
        if (!error) {
            console.log(`Connected to Redis on port ${REDIS_PORT}`);
        }
        if (DEBUG) {
            monitor.on("monitor", (time, args, source) => {
                console.log(time, args, source);
            });
        }
    });

    app.use("/", routes);

    console.log(passport);

    app.listen(PORT, () => {
        console.log(`🚀 Node server running on port ${PORT}`);
    });
};

server().catch((err) => {
    console.log(err);
});
