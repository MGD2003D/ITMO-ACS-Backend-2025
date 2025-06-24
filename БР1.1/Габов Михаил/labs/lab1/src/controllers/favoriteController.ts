import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { Favorite } from "../models";

const favRepo = AppDataSource.getRepository(Favorite);

/**
 * POST /favorites
 * body: { user: { id: number }, recipe: { id: number } }
 */
export const createFavorite: RequestHandler<{}, any, Partial<Favorite>> = async (req, res) => {
    try {
        const fav = favRepo.create(req.body);
        await favRepo.save(fav);
        res.status(201).json(fav);
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ message: err.message ?? "Unknown error" });
    }
    return;
};

/**
 * DELETE /favorites?userId=…&recipeId=…
 */
export const deleteFavorite: RequestHandler<{}, any, any, { userId?: string; recipeId?: string }> = async (
    req,
    res
) => {
    const { userId, recipeId } = req.query;
    if (!userId || !recipeId) {
        res.status(400).json({ message: "userId and recipeId query params required" });
        return;
    }
    const result = await favRepo.delete({
        user:   { id: Number(userId) },
        recipe: { id: Number(recipeId) },
    } as any);
    if (result.affected) res.json({ success: true });
    else res.status(404).json({ message: "Not found" });
    return;
};
