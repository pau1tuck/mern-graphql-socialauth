"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const tslib_1 = require("tslib");
const type_graphql_1 = require("type-graphql");
const argon2_1 = tslib_1.__importDefault(require("argon2"));
const user_entity_1 = require("../entities/user.entity");
const types_1 = require("../config/types");
let UserResolver = class UserResolver {
    users() {
        return user_entity_1.User.find();
    }
    currentUser({ req }) {
        if (!req.session.userId) {
            return null;
        }
        return user_entity_1.User.findOne(req.session.userId);
    }
    register(input, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const matchingUser = yield user_entity_1.User.findOne({
                where: { email: input.email },
            });
            if (matchingUser) {
                throw new Error("Email address already registered");
            }
            const encryptedPassword = yield argon2_1.default.hash(password);
            try {
                yield user_entity_1.User.insert(Object.assign(Object.assign({}, input), { password: encryptedPassword }));
            }
            catch (err) {
                console.log(err);
                return false;
            }
            return true;
        });
    }
    login(email, password, ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const matchingUser = yield user_entity_1.User.findOne({ where: { email } });
            if (!matchingUser || !matchingUser.password) {
                throw new Error("Email address not registered");
            }
            else {
                const checkPassword = yield argon2_1.default.verify(matchingUser.password, password);
                if (!checkPassword) {
                    throw new Error("Incorrect password");
                }
            }
            if (!matchingUser.verified) {
                throw new Error("Email address not verified");
            }
            ctx.req.session.passport = {
                user: { userId: matchingUser.id, roles: matchingUser.roles },
            };
            console.log(`${matchingUser.email} logged in`);
            console.log(ctx.req.session);
            return matchingUser;
        });
    }
    createSuperUser(input, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const matchingUser = yield user_entity_1.User.findOne({
                where: { email: input.email },
            });
            if (matchingUser) {
                throw new Error("Email address already registered");
            }
            const encryptedPassword = yield argon2_1.default.hash(password);
            try {
                yield user_entity_1.User.insert(Object.assign(Object.assign({}, input), { password: encryptedPassword, verified: true, roles: ["ADMIN", "MODERATOR"] }));
            }
            catch (err) {
                console.log(err);
                return false;
            }
            return true;
        });
    }
};
tslib_1.__decorate([
    type_graphql_1.Query(() => [user_entity_1.User], { nullable: true }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
tslib_1.__decorate([
    type_graphql_1.Query(() => user_entity_1.User, { nullable: true }),
    tslib_1.__param(0, type_graphql_1.Ctx()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserResolver.prototype, "currentUser", null);
tslib_1.__decorate([
    type_graphql_1.Mutation(() => Boolean),
    tslib_1.__param(0, type_graphql_1.Arg("input")),
    tslib_1.__param(1, type_graphql_1.Arg("password")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [types_1.UserInput, String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
tslib_1.__decorate([
    type_graphql_1.Mutation(() => user_entity_1.User, { nullable: true }),
    tslib_1.__param(0, type_graphql_1.Arg("email")),
    tslib_1.__param(1, type_graphql_1.Arg("password")),
    tslib_1.__param(2, type_graphql_1.Ctx()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
tslib_1.__decorate([
    type_graphql_1.Mutation(() => Boolean),
    tslib_1.__param(0, type_graphql_1.Arg("input")),
    tslib_1.__param(1, type_graphql_1.Arg("password")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [types_1.UserInput, String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "createSuperUser", null);
UserResolver = tslib_1.__decorate([
    type_graphql_1.Resolver(user_entity_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map