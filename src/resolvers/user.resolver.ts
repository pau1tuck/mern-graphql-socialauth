import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/user.entity";
import { IContext, UserInput } from "../config/types";

@Resolver(User)
export class UserResolver {
    @Query(() => [User], { nullable: true })
    users(): Promise<User[]> {
        return User.find();
    }

    @Query(() => User, { nullable: true })
    currentUser(@Ctx() { req }: IContext) {
        if (!req.session.userId) {
            return null;
        }
        return User.findOne(req.session.userId);
    }

    @Mutation(() => Boolean)
    async register(
        @Arg("input") input: UserInput,
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

        if (!matchingUser || !matchingUser.password) {
            throw new Error("Email address not registered");
        } else {
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

        ctx.req.session.passport = {
            user: { userId: matchingUser.id, roles: matchingUser.roles },
        };

        console.log(`${matchingUser.email} logged in`);
        console.log(ctx.req.session);
        return matchingUser;
    }

    @Mutation(() => Boolean)
    async createSuperUser(
        @Arg("input") input: UserInput,
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
