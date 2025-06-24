import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { Comment } from "../models";

const commentRepo = AppDataSource.getRepository(Comment);

/**
 * POST /comments
 * body: { user: { id: number }, recipe: { id: number }, content: string }
 */
export const createComment: RequestHandler<{}, any, Partial<Comment>> = async (req, res) => {
    try {
        const author = req.user!;

        const { content, recipe } = req.body;

        if (!content || !recipe) {
            res.status(400).json({ message: "Content and recipe are required" });
            return;
        }

        const newCommentData = {
            content: content,
            recipe: recipe,
            user: author,
        };

        const comment = commentRepo.create(newCommentData);
        await commentRepo.save(comment);
        res.status(201).json(comment);

    } catch (err: any) {
        console.error(err);
        res.status(400).json({ message: err.message ?? "Unknown error" });
    }
};

/**
 * GET /comments?recipeId=…
 */
export const getCommentsByRecipe: RequestHandler<{}, any, any, { recipeId?: string }> = async (req, res) => {
    const { recipeId } = req.query;
    if (!recipeId) {
        res.status(400).json({ message: "recipeId query param required" });
        return;
    }
    const comments = await commentRepo.find({
        where: { recipe: { id: Number(recipeId) } as any },
        relations: ["user"],
    });
    res.json(comments);
    return;
};

/**
 * DELETE /comments/:id
 */
export const deleteComment: RequestHandler<{ id: string }> = async (req, res) => {
    const result = await commentRepo.delete(Number(req.params.id));
    if (result.affected) res.json({ success: true });
    else res.status(404).json({ message: "Not found" });
    return;
};
