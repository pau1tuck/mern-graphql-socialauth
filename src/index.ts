import "reflect-metadata";
import "dotenv/config";
import path from "path";
import { v4 } from "uuid";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import { createConnection, Connection } from "typeorm";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import database from "./config/database";
import { UserResolver } from "./resolvers/user.resolver";

const server = async () => {
    const orm: Connection = await createConnection(database);

    const app: Express = express();

    app.use(
        session({
            name: "qid",
            genid: () => v4(),
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
