import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { Recipe } from "../models/Recipe";
import { Ingredient } from "../models/Ingredient";
import { RecipeIngredient } from "../models/RecipeIngredient";

const recipeRepo = AppDataSource.getRepository(Recipe);
const ingRepo    = AppDataSource.getRepository(Ingredient);
const riRepo     = AppDataSource.getRepository(RecipeIngredient);

/**
 * POST /recipes
 */
export const createRecipe: RequestHandler<
    {},
    any,
    Partial<Recipe> & { ingredients?: Array<{ id?: number; name: string; amount: string }> }
> = async (req, res) => {
    try {
        const { ingredients, ...data } = req.body;
        const recipe = recipeRepo.create(data as Partial<Recipe>);

        if (Array.isArray(ingredients)) {
            recipe.recipeIngredients = await Promise.all(
                ingredients.map(async (i) => {
                    let ing: Ingredient;
                    if (i.id) {
                        ing = await ingRepo.findOneByOrFail({ id: i.id });
                    } else {
                        ing = ingRepo.create({ name: i.name });
                        await ingRepo.save(ing);
                    }
                    const ri = riRepo.create();
                    ri.recipe     = recipe;
                    ri.ingredient = ing;
                    ri.amount     = i.amount;
                    return ri;
                })
            );
        }

        await recipeRepo.save(recipe);
        res.status(201).json(recipe);
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ message: err.message ?? "Unknown error" });
    }
};

/**
 * GET /recipes?ingredient=&difficulty=
 */
export const getRecipes: RequestHandler<
    {},
    any,
    any,
    { ingredient?: string; difficulty?: string }
> = async (req, res) => {
    const { ingredient, difficulty } = req.query;
    const qb = recipeRepo
        .createQueryBuilder("r")
        .leftJoinAndSelect("r.recipeIngredients", "ri")
        .leftJoinAndSelect("ri.ingredient", "ing");

    if (difficulty) qb.andWhere("r.difficulty = :d", { d: difficulty });
    if (ingredient) qb.andWhere("ing.name ILIKE :ing", { ing: `%${ingredient}%` });

    const list = await qb.getMany();
    res.json(list);
};

/**
 * GET /recipes/:id
 */
export const getRecipeById: RequestHandler<{ id: string }> = async (req, res) => {
    const recipe = await recipeRepo.findOne({
        where: { id: Number(req.params.id) },
        relations: [
            "recipeIngredients",
            "recipeIngredients.ingredient",
            "comments",
            "likes",
            "favorites",
        ],
    });
    if (recipe) res.json(recipe);
    else res.status(404).json({ message: "Not found" });
};

/**
 * PUT /recipes/:id
 */
export const updateRecipe: RequestHandler<{ id: string }, any, Partial<Recipe>> = async (
    req,
    res
) => {
    try {
        const id = Number(req.params.id);
        const recipe = await recipeRepo.preload({ id, ...req.body });
        if (!recipe) {
            res.status(404).json({ message: "Not found" });
            return;
        }
        await recipeRepo.save(recipe);
        res.json(recipe);
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ message: err.message ?? "Unknown error" });
    }
};

/**
 * DELETE /recipes/:id
 */
export const deleteRecipe: RequestHandler<{ id: string }> = async (req, res) => {
    const result = await recipeRepo.delete(Number(req.params.id));
    if (result.affected) res.json({ success: true });
    else res.status(404).json({ message: "Not found" });
};
