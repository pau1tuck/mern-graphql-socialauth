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
} as Parameters<typeof createConnection>[0];
