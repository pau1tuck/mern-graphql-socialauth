import express, { Request, Response, Router } from "express";
import passport from "passport";

const router: Router = express.Router();
const { DEBUG } = process.env;

router.get("/facebook", passport.authenticate("facebook"));

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/fail",
        failureFlash: true,
        failureMessage: true,
    }),
    (req: Request, res: Response) => {
        if (DEBUG) {
            console.log(req.session);
        }
        res.redirect("/");
    }
);

router.get("/google", passport.authenticate("google"));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/fail",
        failureFlash: true,
        failureMessage: true,
    }),
    (req: Request, res: Response) => {
        if (DEBUG) {
            console.log(req.session);
        }
        res.redirect("/");
    }
);

export default router;
