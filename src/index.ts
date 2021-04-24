import "reflect-metadata";
import "dotenv/config";
import path from "path";
import { v4 } from "uuid";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import passportFacebook from "passport-facebook";
import { createConnection, Connection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
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
                return v4();
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
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.deserializeUser((obj, done) => {
        done(null, false); // invalidates the existing login session.
    });

    const FacebookStrategy = passportFacebook.Strategy;
    passport.use(
        new FacebookStrategy(
            {
                clientID: String(process.env.FACEBOOK_APP_ID),
                clientSecret: String(process.env.FACEBOOK_APP_SECRET),
                callbackURL:
                    "https://e4577d01c7a5.ngrok.io/auth/facebook/callback",
            },
            async (accessToken, refreshToken, profile, cb) => {
                let matchingUser = await User.findOne({
                    where: { facebookId: profile.id },
                });
                if (!matchingUser) {
                    // eslint-disable-next-line no-underscore-dangle
                    console.log(profile._json);
                    try {
                        User.insert({
                            facebookId: profile.id,
                            firstName: profile.displayName,
                            lastName: profile.name?.familyName,
                            email: profile.emails?.[0].value,
                            verified: true,
                        });
                    } catch (err) {
                        console.log(err);
                    }
                    matchingUser = await User.findOne({
                        where: { facebookId: profile.id },
                    });
                }
                passport.serializeUser((user, done) => {
                    done(null, {
                        userId: matchingUser?.id,
                        roles: matchingUser?.roles,
                    });
                });
                cb(null, matchingUser?.id);
            }
        )
    );

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
            failureRedirect: "/fail",
            failureFlash: true,
            failureMessage: true,
        }),
        (req, res) => {
            console.log(req.session);
            res.redirect("/");
        }
    );

    app.use("/static", express.static("public/dist"));

    app.get("/", (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, "../public/index.html"));
    });

    app.listen(process.env.PORT, () => {
        console.log(`🚀 Node server running on port ${process.env.PORT}`);
    });
};

server().catch((err) => {
    console.log(err);
});
