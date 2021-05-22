import { createConnection } from "typeorm";
import { User } from "../entities/user.entity";

const { NODE_ENV, DEBUG, DB_URL } = process.env;

const database = {
    type: "mongodb",
    url: DB_URL,
    synchronize: NODE_ENV !== "production",
    logging: Boolean(DEBUG),
    loggerLevel: "info",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [User],
} as Parameters<typeof createConnection>[0];

export default database;
