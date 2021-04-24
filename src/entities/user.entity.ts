import { ObjectType, Field, ID } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ObjectIdColumn,
    UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @ObjectIdColumn()
    id!: number;

    @Column({ nullable: true, default: null })
    facebookId?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    country?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    password?: string;

    @Field()
    @Column({ default: false })
    verified!: boolean;

    @Field(() => [String], { nullable: true })
    @Column("simple-array", { nullable: true })
    roles?: string[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt!: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: Date;
}
