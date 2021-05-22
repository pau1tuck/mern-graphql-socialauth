"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authChecker = ({ context }, roles) => {
    var _a;
    if (!context.req.session.passport.user.userId) {
        return false;
    }
    if ((_a = context.req.session.passport.user.roles) === null || _a === void 0 ? void 0 : _a.some((role) => roles.includes(role))) {
        return true;
    }
    return false;
};
exports.default = authChecker;
//# sourceMappingURL=check-auth.js.map