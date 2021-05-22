import { Field, InputType } from "type-graphql";

export interface IUser {
    id: number;
    facebookId?: string;
    googleId?: string;
    givenName?: string;
    familyName?: string;
    city?: string;
    country?: string;
    email?: string;
    password?: string;
    verified: boolean;
    roles?: string[];
    createdAt: Date;
    updatedAt: Date;
}

@InputType()
export class RegisterUserInput {
    @Field()
    givenName!: string;

    @Field()
    familyName!: string;

    @Field()
    country!: string;

    @Field()
    email!: string;
}
