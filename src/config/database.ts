import path from "path";
import { createConnection } from "typeorm";

export default {
    name: "mongo",
    type: "mongodb",
    url: process.env.DB_URL,
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.DEBUG,
    loggerLevel: "info",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [path.join(__dirname, "/entities/**/*.ts")],
    migrations: [path.join(__dirname, "/migrations/**/*.ts")],
    cli: {
        migrationsDir: path.join(__dirname, "/migrations/"),
    },
} as Parameters<typeof createConnection>[0];
