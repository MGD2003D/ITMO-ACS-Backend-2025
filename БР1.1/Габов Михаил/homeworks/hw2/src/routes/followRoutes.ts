import { Router } from "express";
import { createFollow, deleteFollow } from "../controllers/followController";

const router = Router();

/**
 * @openapi
 * /follows:
 *   post:
 *     summary: Подписаться на пользователя
 *     tags:
 *       - Follows
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FollowCreate'
 *     responses:
 *       '201':
 *         description: Подписка создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Follow'
 */
router.post("/", createFollow);

/**
 * @openapi
 * /follows:
 *   delete:
 *     summary: Отписаться от пользователя
 *     tags:
 *       - Follows
 *     parameters:
 *       - in: query
 *         name: followerId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: followingId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Отписка выполнена
 *       '404':
 *         description: Подписка не найдена
 */
router.delete("/", deleteFollow);

export default router;
