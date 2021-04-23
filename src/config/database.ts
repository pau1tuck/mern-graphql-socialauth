import path from "path";
import { createConnection } from "typeorm";
import { User } from "../entities/user.entity";

export default {
    type: "mongodb",
    url: process.env.DB_URL,
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.DEBUG,
    loggerLevel: "info",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [User],
} as Parameters<typeof createConnection>[0];
