"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "mongo",
    type: "mongodb",
    url: process.env.DB_URL,
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.DEBUG,
    loggerLevel: "info",
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
//# sourceMappingURL=database.js.map