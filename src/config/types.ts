import { Request, Response } from "express";
import { Field, InputType } from "type-graphql";

export interface IContext {
    req: Request & { session: any };
    res: Response;
    payload?: { passport: { user: { userId: string; roles: string[] } } };
}

@InputType()
export class UserInput {
    @Field()
    givenName!: string;

    @Field()
    familyName!: string;

    @Field()
    country!: string;

    @Field()
    email!: string;

    @Field({ defaultValue: false })
    verified!: boolean;

    @Field(() => [String], { nullable: true })
    roles?: string[];
}
