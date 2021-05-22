import { AuthChecker } from "type-graphql";
import { IContext } from "../types/context";

const authChecker: AuthChecker<IContext> = ({ context }, roles) => {
    if (!context.req.session.passport.user.userId) {
        return false;
    }
    if (
        context.req.session.passport.user.roles?.some((role: string) =>
            roles.includes(role)
        )
    ) {
        return true;
    }
    return false;
};

export default authChecker;
