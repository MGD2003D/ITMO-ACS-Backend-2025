import { Router } from "express";
import {
    createRecipe,
    getRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
} from "../controllers/recipeController";

const router = Router();

/**
 * @openapi
 * /recipes:
 *   post:
 *     summary: Создать рецепт
 *     tags:
 *       - Recipes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeCreate'
 *     responses:
 *       '201':
 *         description: Рецепт создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */
router.post("/", createRecipe);

/**
 * @openapi
 * /recipes:
 *   get:
 *     summary: Получить список рецептов с фильтрами
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: query
 *         name: ingredient
 *         schema:
 *           type: string
 *         description: Фильтр по названию ингредиента
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *         description: Фильтр по сложности
 *     responses:
 *       '200':
 *         description: Массив рецептов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/", getRecipes);

/**
 * @openapi
 * /recipes/{id}:
 *   get:
 *     summary: Получить рецепт по ID
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Рецепт найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeDetail'
 *       '404':
 *         description: Рецепт не найден
 */
router.get("/:id", getRecipeById);

/**
 * @openapi
 * /recipes/{id}:
 *   put:
 *     summary: Обновить рецепт
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeUpdate'
 *     responses:
 *       '200':
 *         description: Рецепт обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       '404':
 *         description: Рецепт не найден
 */
router.put("/:id", updateRecipe);

/**
 * @openapi
 * /recipes/{id}:
 *   delete:
 *     summary: Удалить рецепт
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Рецепт удалён
 *       '404':
 *         description: Рецепт не найден
 */
router.delete("/:id", deleteRecipe);

export default router;
