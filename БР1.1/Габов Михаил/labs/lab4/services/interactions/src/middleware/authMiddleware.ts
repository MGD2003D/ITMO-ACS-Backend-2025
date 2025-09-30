import { Request } from "express";

export async function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {

    if (securityName === "jwt") {
        const userId = request.headers["x-user-id"];

        if (!userId) {
            throw new Error("User ID not provided by API Gateway");
        }
        
        return Promise.resolve({
            id: Number(userId)
        });
    }

    throw new Error("Unknown security name");
}