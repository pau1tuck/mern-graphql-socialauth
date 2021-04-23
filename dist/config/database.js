"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
exports.default = {
    name: "mongo",
    type: "mongodb",
    url: process.env.DB_URL,
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.DEBUG,
    loggerLevel: "info",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [path_1.default.join(__dirname, "/entities/**/*.ts")],
    migrations: [path_1.default.join(__dirname, "/migrations/**/*.ts")],
    cli: {
        migrationsDir: path_1.default.join(__dirname, "/migrations"),
    },
};
//# sourceMappingURL=database.js.map