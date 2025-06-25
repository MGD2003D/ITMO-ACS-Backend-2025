import { Request } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../models";

const userRepo = AppDataSource.getRepository(User);

export async function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {

    if (securityName === "jwt") {
        const token = request.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new Error("No token provided");
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in .env file");
        }

        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
                if (err) {
                    return reject(err);
                }

                const user = await userRepo.findOneBy({ id: decoded.userId });
                if (!user) {
                    return reject(new Error("User for token not found"));
                }

                (request as any).user = user;
                resolve(user);
            });
        });
    }

    throw new Error("Unknown security name");
}