import { v4 } from "uuid";
import { RedisStore, redisClient } from "./redis.config";

const { NODE_ENV, SESSION_SECRET } = process.env;

const sessionConfig = {
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
        sameSite: NODE_ENV === "production",
        secure: NODE_ENV === "production",
    },
    secret: SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
};

export default sessionConfig;
