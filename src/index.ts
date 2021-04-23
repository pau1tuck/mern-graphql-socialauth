import "reflect-metadata";
import "dotenv/config";
import path from "path";
import { v4 } from "uuid";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import { createConnection, Connection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import database from "./config/database";

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
                sameSite: !!process.env.PRODUCTION || "lax",
                secure: !!process.env.PRODUCTION,
            },
            secret: process.env.SESSION_SECRET || "secret",
            resave: false,
            saveUninitialized: false,
        })
    );

    if (orm.isConnected) {
        console.log(`Connected to MongoDB`);
    }

    app.listen(process.env.PORT, () => {
        console.log(`🚀 Node server running on port ${process.env.PORT}`);
    });
};

server().catch((err) => {
    console.log(err);
});
