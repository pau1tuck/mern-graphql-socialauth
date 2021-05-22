import connectRedis from "connect-redis";
import Redis from "ioredis";
import session from "express-session";

export const RedisStore = connectRedis(session);
export const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    family: parseInt(process.env.REDIS_FAMILY, 10) || 4,
    password: process.env.REDIS_PASS,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    enableReadyCheck: Boolean(process.env.DEBUG) || true,
});
