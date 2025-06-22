import { Router } from "express";
import { createFavorite, deleteFavorite } from "../controllers/favoriteController";

const router = Router();

/**
 * @openapi
 * /favorites:
 *   post:
 *     summary: Добавить рецепт в избранное
 *     tags:
 *       - Favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FavoriteCreate'
 *     responses:
 *       '201':
 *         description: В избранное добавлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 */
router.post("/", createFavorite);

/**
 * @openapi
 * /favorites:
 *   delete:
 *     summary: Удалить рецепт из избранного
 *     tags:
 *       - Favorites
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
 *         description: Успешно удалено из избранного
 *       '404':
 *         description: Запись не найдена
 */
router.delete("/", deleteFavorite);

export default router;
