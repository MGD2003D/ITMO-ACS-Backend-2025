import { Router } from "express";
import { createComment, getCommentsByRecipe, deleteComment } from "../controllers/commentController";

const router = Router();

/**
 * @openapi
 * /comments:
 *   post:
 *     summary: Оставить комментарий к рецепту
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentCreate'
 *     responses:
 *       '201':
 *         description: Комментарий добавлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
router.post("/", createComment);

/**
 * @openapi
 * /comments:
 *   get:
 *     summary: Получить все комментарии к рецепту
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: query
 *         name: recipeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Массив комментариев
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get("/", getCommentsByRecipe);

/**
 * @openapi
 * /comments/{id}:
 *   delete:
 *     summary: Удалить комментарий
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Комментарий удалён
 *       '404':
 *         description: Комментарий не найден
 */
router.delete("/:id", deleteComment);

export default router;
