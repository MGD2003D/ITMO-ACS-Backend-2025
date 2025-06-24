import { Router } from "express";
import { createFavorite, deleteFavorite } from "../controllers/favoriteController";

const router = Router();
router.post("/", createFavorite);
router.delete("/", deleteFavorite);

export default router;
