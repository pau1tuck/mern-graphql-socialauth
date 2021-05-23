import path from "path";
import express, { Request, Response, Router } from "express";
import auth from "./auth.routes";

const router: Router = express.Router();

router.use("/auth", auth);

router.use("/static", express.static(path.resolve(__dirname, "public/dist")));

router.get("/", (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../public/index.html"));
});

export default router;
