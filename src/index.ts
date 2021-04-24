import "reflect-metadata";
import "dotenv/config";
import path from "path";
import { v4 } from "uuid";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import passportFacebook from "passport-facebook";
import { createConnection, Connection } from "typeorm";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import database from "./config/database";
import { UserResolver } from "./resolvers/user.resolver";
import { User } from "./entities/user.entity";

const server = async () => {
    const orm: Connection = await createConnection(database);

    const app: Express = express();

    app.set("trust proxy", 1);

    app.use(
        session({
            name: "sid",
            genid: (req) => {
                console.log(req.sessionID);
                return v4();
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
        })
    );

    passport.session();

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    const FacebookStrategy = passportFacebook.Strategy;
    passport.use(
        new FacebookStrategy(
            {
                clientID: String(process.env.FACEBOOK_APP_ID),
                clientSecret: String(process.env.FACEBOOK_APP_SECRET),
                callbackURL:
                    "https://3f6026033a33.ngrok.io/auth/facebook/callback",
            },
            async (accessToken, refreshToken, profile, cb) => {
                console.log(`Profile: ${profile.id}`);
                const user = await User.findOne({
                    where: { facebookId: profile.id },
                });
                if (user) {
                    cb(null, user);
                } else {
                    console.log("User does not exist.");
                }
            }
        )
    );

    app.use(passport.initialize());
    console.log(app);

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
        console.log(`Connected to MongoDB`);
    }

    app.get("/auth/facebook", passport.authenticate("facebook"));

    app.get(
        "/auth/facebook/callback",
        passport.authenticate("facebook", {
            failureRedirect: "/",
            failureFlash: true,
        }),
        (req, res: Response) => {
            console.log(req.session);
            res.redirect("/");
        }
    );

    app.use("/static", express.static("public/dist"));

    app.get("/", (req: Request, res: Response) => {
        console.log(req.sessionID);
        res.sendFile(path.resolve(__dirname, "../public/index.html"));
    });

    app.listen(process.env.PORT, () => {
        console.log(`🚀 Node server running on port ${process.env.PORT}`);
    });
};

server().catch((err) => {
    console.log(err);
});
