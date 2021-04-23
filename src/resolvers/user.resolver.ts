import path from "path";
import { Errback } from "express";
import {
    Arg,
    Ctx,
    InputType,
    Field,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import argon2 from "argon2";
import { User } from "../entities/user.entity";
import { IContext, UserInput } from "../config/types";

@Resolver(User)
export class UserResolver {
    @Query(() => [User], { nullable: true })
    readUsers(): Promise<User[]> {
        return User.find();
    }

    @Query(() => User, { nullable: true })
    readUser(@Ctx() { req }: IContext) {
        if (!req.session.userId) {
            return null;
        }
        return User.findOne(req.session.userId);
    }

    @Mutation(() => Boolean)
    async createUser(
        @Arg("input") input: UserInput,
        @Arg("password") password: string
    ) {
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
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Email address not registered");
        }

        const checkPassword = await argon2.verify(user.password, password);
        if (!checkPassword) {
            throw new Error("Incorrect password");
        }

        if (!user.verified) {
            throw new Error("Email address not verified");
        }

        ctx.req.session.userId = user.id;
        ctx.req.session.roles = user.roles;

        console.log(`${user.email} logged in`);
        return user;
    }
}
