"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserInput = void 0;
const tslib_1 = require("tslib");
const type_graphql_1 = require("type-graphql");
let RegisterUserInput = class RegisterUserInput {
};
tslib_1.__decorate([
    type_graphql_1.Field(),
    tslib_1.__metadata("design:type", String)
], RegisterUserInput.prototype, "givenName", void 0);
tslib_1.__decorate([
    type_graphql_1.Field(),
    tslib_1.__metadata("design:type", String)
], RegisterUserInput.prototype, "familyName", void 0);
tslib_1.__decorate([
    type_graphql_1.Field(),
    tslib_1.__metadata("design:type", String)
], RegisterUserInput.prototype, "country", void 0);
tslib_1.__decorate([
    type_graphql_1.Field(),
    tslib_1.__metadata("design:type", String)
], RegisterUserInput.prototype, "email", void 0);
RegisterUserInput = tslib_1.__decorate([
    type_graphql_1.InputType()
], RegisterUserInput);
exports.RegisterUserInput = RegisterUserInput;
//# sourceMappingURL=user.js.map