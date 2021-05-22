import { Request, Response } from "express";
import { Redis } from "ioredis";

export interface IContext {
    req: Request & {
        session: {
            passport: { user: { userId: number; roles: string[] | undefined } };
        };
    };
    res: Response;
    redis: Redis;
}
