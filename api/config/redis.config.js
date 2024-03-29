"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.RedisStore = void 0;
const tslib_1 = require("tslib");
const connect_redis_1 = tslib_1.__importDefault(require("connect-redis"));
const ioredis_1 = tslib_1.__importDefault(require("ioredis"));
const express_session_1 = tslib_1.__importDefault(require("express-session"));
exports.RedisStore = connect_redis_1.default(express_session_1.default);
exports.redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    family: parseInt(process.env.REDIS_FAMILY, 10) || 4,
    password: process.env.REDIS_PASS,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    enableReadyCheck: Boolean(process.env.DEBUG) || true,
});
//# sourceMappingURL=redis.config.js.map