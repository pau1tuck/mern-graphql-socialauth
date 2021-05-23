"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const express_1 = tslib_1.__importDefault(require("express"));
const auth_routes_1 = tslib_1.__importDefault(require("./auth.routes"));
const router = express_1.default.Router();
router.use("/auth", auth_routes_1.default);
router.use("/static", express_1.default.static(path_1.default.resolve(__dirname, "public/dist")));
router.get("/", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../../public/index.html"));
});
exports.default = router;
//# sourceMappingURL=index.js.map