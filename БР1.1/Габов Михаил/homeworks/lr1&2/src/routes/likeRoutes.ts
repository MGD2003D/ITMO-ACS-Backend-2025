import { Router } from "express";
import { createLike, deleteLike } from "../controllers/likeController";

const router = Router();

/**
 * @openapi
 * /likes:
 *   post:
 *     summary: Поставить лайк рецепту
 *     tags:
 *       - Likes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LikeCreate'
 *     responses:
 *       '201':
 *         description: Лайк сохранён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 */
router.post("/", createLike);

/**
 * @openapi
 * /likes:
 *   delete:
 *     summary: Удалить лайк
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: recipeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Лайк удалён
 *       '404':
 *         description: Лайк не найден
 */
router.delete("/", deleteLike);

export default router;
