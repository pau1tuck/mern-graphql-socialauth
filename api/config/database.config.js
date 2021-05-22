"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("../entities/user.entity");
const { NODE_ENV, DEBUG, DB_URL } = process.env;
const database = {
    type: "mongodb",
    url: DB_URL,
    synchronize: NODE_ENV !== "production",
    logging: Boolean(DEBUG),
    loggerLevel: "info",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [user_entity_1.User],
};
exports.default = database;
//# sourceMappingURL=database.config.js.map