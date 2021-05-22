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
import { passportStrategies } from "./config/passport";
import { mongodb } from "./config/database";
import { RedisStore, redisClient } from "./config/redis";
import { UserResolver } from "./resolvers/user.resolver";

const { NODE_ENV, DEBUG, PORT, REDIS_PORT, SESSION_SECRET } = process.env;

const server = async () => {
    const orm: Connection = await createConnection(mongodb);

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
    });

    const apolloServer = new ApolloServer({
        schema: graphQLSchema,
        context: ({ req, res }: Request & Response) => ({
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

    redisClient.monitor((error, monitor) => {
        if (!error) {
            console.log(`Connected to Redis on port ${REDIS_PORT}`);
        }
        if (process.env.DEBUG) {
            monitor.on("monitor", (time, args, source) => {
                console.log(time, args, source);
            });
        }
    });

    app.get("/auth/facebook", passport.authenticate("facebook"));

    app.get(
        "/auth/facebook/callback",
        passport.authenticate("facebook", {
            failureRedirect: "/fail",
            failureFlash: true,
            failureMessage: true,
        }),
        (req: Request, res: Response) => {
            console.log(req.session);
            res.redirect("/");
        }
    );

    app.get("/auth/google", passport.authenticate("google"));

    app.get(
        "/auth/google/callback",
        passport.authenticate("google", {
            failureRedirect: "/fail",
            failureFlash: true,
            failureMessage: true,
        }),
        (req: Request, res: Response) => {
            if (DEBUG) {
                console.log(req.session);
            }
            res.redirect("/");
        }
    );

    app.use("/static", express.static("public/dist"));

    app.get("/", (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, "../public/index.html"));
    });

    app.listen(PORT, () => {
        console.log(`🚀 Node server running on port ${PORT}`);
    });
};

server().catch((err) => {
    console.log(err);
});
