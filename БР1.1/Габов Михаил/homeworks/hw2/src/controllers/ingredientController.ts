import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { Ingredient } from "../models/Ingredient";

const repo = AppDataSource.getRepository(Ingredient);

/**
 * POST /ingredients
 */
export const createIngredient: RequestHandler<{}, any, Partial<Ingredient>> = async (req, res) => {
    try {
        const ing = repo.create(req.body);
        await repo.save(ing);
        res.status(201).json(ing);
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ message: err.message ?? "Unknown error" });
    }
    return;
};

/**
 * GET /ingredients
 */
export const getAllIngredients: RequestHandler = async (_req, res) => {
    const items = await repo.find();
    res.json(items);
    return;
};

/**
 * GET /ingredients/:id
 */
export const getIngredientById: RequestHandler<{ id: string }> = async (req, res) => {
    const ing = await repo.findOneBy({ id: Number(req.params.id) });
    if (ing) res.json(ing);
    else res.status(404).json({ message: "Not found" });
    return;
};

/**
 * PUT /ingredients/:id
 */
export const updateIngredient: RequestHandler<{ id: string }, any, Partial<Ingredient>> = async (
    req,
    res
) => {
    try {
        const id = Number(req.params.id);
        const ing = await repo.preload({ id, ...req.body });
        if (!ing) {
            res.status(404).json({ message: "Not found" });
            return;
        }
        await repo.save(ing);
        res.json(ing);
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ message: err.message ?? "Unknown error" });
    }
    return;
};

/**
 * DELETE /ingredients/:id
 */
export const deleteIngredient: RequestHandler<{ id: string }> = async (req, res) => {
    const result = await repo.delete(Number(req.params.id));
    if (result.affected) res.json({ success: true });
    else res.status(404).json({ message: "Not found" });
    return;
};
