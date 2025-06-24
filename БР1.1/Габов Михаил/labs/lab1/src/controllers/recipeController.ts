import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { Recipe } from "../models";
import { Ingredient } from "../models";
import { RecipeIngredient } from "../models";
import { RecipeStep } from "../models";

const recipeRepo = AppDataSource.getRepository(Recipe);
const ingRepo    = AppDataSource.getRepository(Ingredient);
const riRepo     = AppDataSource.getRepository(RecipeIngredient);
const stepRepo   = AppDataSource.getRepository(RecipeStep);

type RecipeStepCreate = {
    stepNumber: number;
    description: string;
    imageUrl?: string;
};

/**
 * POST /recipes
 */
export const createRecipe: RequestHandler<
    {},
    any,
    Partial<Recipe> & {
    ingredients?: Array<{ id?: number; name: string; amount: string }>;
    steps?: RecipeStepCreate[];
}
> = async (req, res) => {
    try {
        const { ingredients, steps, ...data } = req.body;
        const recipe = recipeRepo.create(data as Partial<Recipe>);

        if (Array.isArray(ingredients)) {
            recipe.recipeIngredients = await Promise.all(
                ingredients.map(async (i) => {
                    let ing: Ingredient;
                    if (!i.id) {
                        ing = ingRepo.create({ name: i.name });
                        await ingRepo.save(ing);
                    } else {
                        ing = await ingRepo.findOneByOrFail({ id: i.id });
                    }
                    const ri = riRepo.create();
                    ri.recipe     = recipe;
                    ri.ingredient = ing;
                    ri.amount     = i.amount;
                    return ri;
                })
            );
        }

        if (Array.isArray(steps)) {
            recipe.steps = steps.map((s) => stepRepo.create(s));
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
            "steps",
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
export const updateRecipe: RequestHandler<{ id: string }, any,
    Partial<Recipe> & { steps?: RecipeStepCreate[] }
> = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { steps, ...data } = req.body;

        const recipe = await recipeRepo.preload({ id, ...data });
        if (!recipe) {
            res.status(404).json({ message: "Not found" });
            return;
        }

        await AppDataSource.transaction(async (em) => {
            if (Array.isArray(steps)) {
                await em.delete(RecipeStep, { recipe: { id } });
                const newSteps = steps.map((s) => {
                    const step = em.create(RecipeStep, s);
                    step.recipe = recipe;
                    return step;
                });
                recipe.steps = await em.save(newSteps);
            }
            await em.save(Recipe, recipe);
        });

        res.json(await recipeRepo.findOneBy({ id }));
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
