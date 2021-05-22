import { createConnection } from "typeorm";
import { User } from "../entities/user.entity";

const { NODE_ENV, DEBUG, DB_URL } = process.env;

export const mongodb = {
    type: "mongodb",
    url: DB_URL,
    synchronize: NODE_ENV !== "production",
    logging: DEBUG,
    loggerLevel: "info",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [User],
} as Parameters<typeof createConnection>[0];
