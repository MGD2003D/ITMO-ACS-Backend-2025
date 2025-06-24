import { Router } from "express";
import { createLike, deleteLike } from "../controllers/likeController";

const router = Router();
router.post("/", createLike);
router.delete("/", deleteLike);

export default router;
