import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const repo = AppDataSource.getRepository(User);

export const createUser: RequestHandler<{}, any, Partial<User>> = async (req, res) => {
    try {
        const user = repo.create(req.body);
        await repo.save(user);
        res.status(201).json(user);
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ message: err.message ?? "Unknown error" });
    }
};

export const getAllUsers: RequestHandler = async (_req, res) => {
    const users = await repo.find();
    res.json(users);
};

export const searchUser: RequestHandler<{}, any, any, { id?: string; email?: string }> =
    async (req, res) => {
        const { id, email } = req.query;
        if (!id && !email) {
            res.status(400).json({ message: "id or email query param required" });
            return;
        }
        let user: User | null = null;
        if (id) user = await repo.findOneBy({ id: Number(id) });
        else if (email) user = await repo.findOneBy({ email });
        user
            ? res.json(user)
            : res.status(404).json({ message: "Not found" });
    };

export const getUserById: RequestHandler<{ id: string }> = async (req, res) => {
    const user = await repo.findOneBy({ id: Number(req.params.id) });
    user
        ? res.json(user)
        : res.status(404).json({ message: "Not found" });
};

export const updateUser: RequestHandler<{ id: string }, any, Partial<User>> =
    async (req, res) => {
        try {
            const id = Number(req.params.id);
            const user = await repo.preload({ id, ...req.body });
            if (!user) {
                res.status(404).json({ message: "Not found" });
                return;
            }
            await repo.save(user);
            res.json(user);
        } catch (err: any) {
            console.error(err);
            res.status(400).json({ message: err.message ?? "Unknown error" });
        }
    };

export const deleteUser: RequestHandler<{ id: string }> = async (req, res) => {
    const result = await repo.delete(Number(req.params.id));
    result.affected
        ? res.json({ success: true })
        : res.status(404).json({ message: "Not found" });
};

export const loginUser: RequestHandler<
    {},
    any,
    { email?: string; password?: string }
> = async (req, res): Promise<void> => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
            res.status(500).json({ message: "Internal server configuration error." });
            return;
        }

        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await repo.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
};