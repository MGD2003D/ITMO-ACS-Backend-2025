import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { Like } from "../models/Like";

const likeRepo = AppDataSource.getRepository(Like);

/**
 * POST /likes
 * body: { user: { id: number }, recipe: { id: number } }
 */
export const createLike: RequestHandler<{}, any, Partial<Like>> = async (req, res) => {
    try {
        const like = likeRepo.create(req.body);
        await likeRepo.save(like);
        res.status(201).json(like);
        return;
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ message: err.message ?? "Unknown error" });
        return;
    }
};

/**
 * DELETE /likes?userId=…&recipeId=…
 */
export const deleteLike: RequestHandler<{}, any, any, { userId?: string; recipeId?: string }> = async (
    req,
    res
) => {
    const { userId, recipeId } = req.query;

    if (!userId || !recipeId) {
        res.status(400).json({ message: "userId and recipeId query params required" });
        return;
    }

    const result = await likeRepo.delete({
        user:   { id: Number(userId) },
        recipe: { id: Number(recipeId) },
    } as any);

    if (result.affected) {
        res.json({ success: true });
    } else {
        res.status(404).json({ message: "Not found" });
    }
    return;
};
