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
import sessionConfig from "./config/session.config";
import { passportStrategies } from "./config/passport.config";
import databaseConfig from "./config/database.config";
import { RedisStore, redisClient } from "./config/redis.config";
import authChecker from "./utils/check-auth";
import { UserResolver } from "./resolvers/user.resolver";
import routes from "./routes";

const { NODE_ENV, DEBUG, HOST, PORT, REDIS_HOST, REDIS_PORT, SESSION_SECRET } =
    process.env;

const server = async () => {
    const orm: Connection = await createConnection(databaseConfig);

    const app: Express = express();

    app.set("trust proxy", 1);

    app.use(session(sessionConfig));

    app.use(passport.initialize());
    app.use(passport.session());

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

    app.use("/", routes);

    if (orm.isConnected) {
        console.log("Connected to remote database");
    }

    redisClient.monitor((error, monitor) => {
        if (!error) {
            console.log(`Connected to Redis on ${REDIS_HOST}:${REDIS_PORT}`);
        }
        if (DEBUG) {
            monitor.on("monitor", (time, args, source) => {
                console.log(time, args, source);
            });
        }
    });

    app.listen(PORT, () => {
        console.log(`🚀 Node server running on ${HOST}:${PORT}`);
    });
};

server().catch((err) => {
    console.log(err);
});
