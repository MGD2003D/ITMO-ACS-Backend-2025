import { Router } from "express";
import {
    createIngredient,
    getAllIngredients,
    getIngredientById,
    updateIngredient,
    deleteIngredient,
} from "../controllers/ingredientController";

const router = Router();
router.post("/", createIngredient);
router.get("/", getAllIngredients);
router.get("/:id", getIngredientById);
router.put("/:id", updateIngredient);
router.delete("/:id", deleteIngredient);

export default router;
