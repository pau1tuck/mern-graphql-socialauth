"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const router = express_1.default.Router();
const { DEBUG } = process.env;
router.get("/facebook", passport_1.default.authenticate("facebook"));
router.get("/facebook/callback", passport_1.default.authenticate("facebook", {
    failureRedirect: "/fail",
    failureFlash: true,
    failureMessage: true,
}), (req, res) => {
    if (DEBUG) {
        console.log(req.session);
    }
    res.redirect("/");
});
router.get("/google", passport_1.default.authenticate("google"));
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "/fail",
    failureFlash: true,
    failureMessage: true,
}), (req, res) => {
    if (DEBUG) {
        console.log(req.session);
    }
    res.redirect("/");
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map