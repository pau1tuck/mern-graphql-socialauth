"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInput = void 0;
const tslib_1 = require("tslib");
const type_graphql_1 = require("type-graphql");
let UserInput = class UserInput {
};
tslib_1.__decorate([
    type_graphql_1.Field(),
    tslib_1.__metadata("design:type", String)
], UserInput.prototype, "givenName", void 0);
tslib_1.__decorate([
    type_graphql_1.Field(),
    tslib_1.__metadata("design:type", String)
], UserInput.prototype, "familyName", void 0);
tslib_1.__decorate([
    type_graphql_1.Field(),
    tslib_1.__metadata("design:type", String)
], UserInput.prototype, "country", void 0);
tslib_1.__decorate([
    type_graphql_1.Field(),
    tslib_1.__metadata("design:type", String)
], UserInput.prototype, "email", void 0);
UserInput = tslib_1.__decorate([
    type_graphql_1.InputType()
], UserInput);
exports.UserInput = UserInput;
//# sourceMappingURL=types.js.map