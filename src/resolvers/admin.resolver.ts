import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/user.entity";
import { IContext } from "../types/context";
import { RegisterUserInput } from "../types/user";
import { serializeUser } from "../config/passport.config";

@Resolver(User)
export class AdminResolver {
    @Authorized("ADMIN")
    @Query(() => [User], { nullable: true })
    getUsers(): Promise<User[]> {
        return User.find();
    }

    @Authorized("ADMIN")
    @Mutation(() => Boolean)
    async createUser(
        @Arg("input") input: RegisterUserInput,
        @Arg("password") password: string,
        @Arg("city") city?: string,
        @Arg("roles") roles?: string[]
    ) {
        const encryptedPassword = await argon2.hash(password);
        try {
            await User.insert({
                ...input,
                city,
                password: encryptedPassword,
                verified: true,
                roles,
            });
        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    }
}
