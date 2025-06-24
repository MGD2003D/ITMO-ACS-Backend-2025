import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../models";

const userRepo = AppDataSource.getRepository(User);

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!process.env.JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
        res.status(500).json({ message: "Internal server configuration error." });
        return;
    }

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };
        const foundUser = await userRepo.findOneBy({ id: decoded.userId });

        if (!foundUser) {
            res.status(401).json({ message: "Not authorized, user for token not found" });
            return;
        }

        req.user = foundUser;
        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};