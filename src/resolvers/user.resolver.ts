import { Errback } from "express";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/user.entity";
import { IContext } from "../types/context";
import { RegisterUserInput } from "../types/user";
import { serializeUser } from "../config/passport.config";

@Resolver(User)
export class UserResolver {
    @Authorized("ADMIN")
    @Query(() => [User], { nullable: true })
    users(): Promise<User[]> {
        return User.find();
    }

    @Query(() => User, { nullable: true })
    currentUser(@Ctx() { req }: IContext) {
        if (!req.session.passport.user.userId) {
            return null;
        }
        return User.findOne(req.session.passport.user.userId);
    }

    @Mutation(() => Boolean)
    async register(
        @Arg("input") input: RegisterUserInput,
        @Arg("password") password: string
    ) {
        const matchingUser = await User.findOne({
            where: { email: input.email },
        });
        if (matchingUser) {
            throw new Error("Email address already registered");
        }

        const encryptedPassword = await argon2.hash(password);
        try {
            await User.insert({
                ...input,
                password: encryptedPassword,
            });
        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    }

    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: IContext
    ): Promise<User | null> {
        const matchingUser = await User.findOne({ where: { email } });

        if (!matchingUser) {
            throw new Error("Email address not registered");
        }

        if (!matchingUser.password) {
            throw new Error("Password not set");
        }

        if (matchingUser.password) {
            const checkPassword = await argon2.verify(
                matchingUser.password,
                password
            );
            if (!checkPassword) {
                throw new Error("Incorrect password");
            }
        }

        if (!matchingUser.verified) {
            throw new Error("Email address not verified");
        }

        /* ctx.req.session.passport = {
            user: { userId: matchingUser.id, roles: matchingUser.roles },
        }; */

        serializeUser(matchingUser);

        console.log(`${matchingUser.email} logged in`);
        console.log(ctx.req.session);
        return matchingUser;
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { req, res }: IContext) {
        return new Promise((resolve) =>
            req.session.destroy((err: Errback) => {
                res.clearCookie("sid");
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }

                resolve(true);
            })
        );
    }

    @Mutation(() => Boolean)
    async deleteUser(@Ctx() { req, res }: IContext): Promise<boolean> {
        try {
            await User.delete({ id: req.session.passport.user.userId });
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
        return new Promise((resolve) =>
            req.session.destroy((err: Errback) => {
                res.clearCookie("sid");
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        );
    }

    @Authorized("ADMIN")
    @Mutation(() => Boolean)
    async createSuperUser(
        @Arg("input") input: RegisterUserInput,
        @Arg("password") password: string
    ) {
        const matchingUser = await User.findOne({
            where: { email: input.email },
        });
        if (matchingUser) {
            throw new Error("Email address already registered");
        }

        const encryptedPassword = await argon2.hash(password);
        try {
            await User.insert({
                ...input,
                password: encryptedPassword,
                verified: true,
                roles: ["ADMIN", "MODERATOR"],
            });
        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    }
}
