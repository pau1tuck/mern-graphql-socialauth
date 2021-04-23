"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("../entities/user.entity");
exports.default = {
    type: "mongodb",
    url: process.env.DB_URL,
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.DEBUG,
    loggerLevel: "info",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [user_entity_1.User],
};
//# sourceMappingURL=database.js.map