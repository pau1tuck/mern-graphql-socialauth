import { v4 } from "uuid";
import { Profile } from "passport-facebook";
import { User } from "../entities/user.entity";
import { IContext, UserInput } from "../config/types";

const facebookCallback = async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
) => {
    const matchingUser = User.findOne({ where: { facebookId: profile.id } });
    if (matchingUser) {
        done(null, matchingUser);
        return;
    }
    const newUser = {
        id: () => v4(),
        facebookId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        country: profile.name.country,
        email: profile.emails && profile.emails[0] && profile.emails[0].value,
    };
    users.push(newUser);
    done(null, newUser);
};
