"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongodb = void 0;
const user_entity_1 = require("../entities/user.entity");
const { NODE_ENV, DEBUG, DB_URL } = process.env;
exports.mongodb = {
    type: "mongodb",
    url: DB_URL,
    synchronize: NODE_ENV !== "production",
    logging: Boolean(DEBUG),
    loggerLevel: "info",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [user_entity_1.User],
};
//# sourceMappingURL=database.js.map