import { Router } from "express";
import { createComment, getCommentsByRecipe, deleteComment } from "../controllers/commentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();
router.post("/", protect, createComment);
router.get("/", getCommentsByRecipe);
router.delete("/:id", protect, deleteComment);

export default router;
