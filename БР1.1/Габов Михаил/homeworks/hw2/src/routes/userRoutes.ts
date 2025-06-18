import { Router } from "express";
import {
    createUser,
    getAllUsers,
    searchUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController";

const router = Router();

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       '201':
 *         description: Пользователь создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/", createUser);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: Массив пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", getAllUsers);

/**
 * @openapi
 * /users/search/by:
 *   get:
 *     summary: Поиск пользователя по id или email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Найденный пользователь
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Не переданы id или email
 *       '404':
 *         description: Пользователь не найден
 */
router.get("/search/by", searchUser);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Пользователь найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: Пользователь не найден
 */
router.get("/:id", getUserById);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Обновить пользователя
 *     tags:
 *       - Users
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
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       '200':
 *         description: Данные пользователя обновлены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: Пользователь не найден
 */
router.put("/:id", updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Пользователь удалён
 *       '404':
 *         description: Пользователь не найден
 */
router.delete("/:id", deleteUser);

export default router;
