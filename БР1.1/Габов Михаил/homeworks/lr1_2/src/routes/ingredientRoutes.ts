import { Router } from "express";
import {
    createIngredient,
    getAllIngredients,
    getIngredientById,
    updateIngredient,
    deleteIngredient,
} from "../controllers/ingredientController";

const router = Router();

/**
 * @openapi
 * /ingredients:
 *   post:
 *     summary: Создать ингредиент
 *     tags:
 *       - Ingredients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IngredientCreate'
 *     responses:
 *       '201':
 *         description: Ингредиент создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 */
router.post("/", createIngredient);

/**
 * @openapi
 * /ingredients:
 *   get:
 *     summary: Получить все ингредиенты
 *     tags:
 *       - Ingredients
 *     responses:
 *       '200':
 *         description: Список ингредиентов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 */
router.get("/", getAllIngredients);

/**
 * @openapi
 * /ingredients/{id}:
 *   get:
 *     summary: Получить ингредиент по ID
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Ингредиент найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       '404':
 *         description: Ингредиент не найден
 */
router.get("/:id", getIngredientById);

/**
 * @openapi
 * /ingredients/{id}:
 *   put:
 *     summary: Обновить ингредиент
 *     tags:
 *       - Ingredients
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
 *             $ref: '#/components/schemas/IngredientCreate'
 *     responses:
 *       '200':
 *         description: Ингредиент обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       '404':
 *         description: Ингредиент не найден
 */
router.put("/:id", updateIngredient);

/**
 * @openapi
 * /ingredients/{id}:
 *   delete:
 *     summary: Удалить ингредиент
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Ингредиент удалён
 *       '404':
 *         description: Ингредиент не найден
 */
router.delete("/:id", deleteIngredient);

export default router;
