import {
    Body, Controller, Delete, Get, Path, Post, Put, Query, Request, Route, Security, SuccessResponse, Tags
} from "tsoa";
import { AppDataSource } from "../data-source";
import { Ingredient, Recipe, RecipeIngredient, RecipeStep, User } from "../models";
import {
    RecipeCreateDto, RecipeDetailResponseDto, RecipeListResponseDto, RecipeUpdateDto
} from "../dtos/recipe.dto";
import { FindManyOptions } from "typeorm";
import { Request as ExpressRequest } from "express";

@Route("recipes")
@Tags("Recipes")
export class RecipeController extends Controller {
    private recipeRepo = AppDataSource.getRepository(Recipe);
    private ingRepo = AppDataSource.getRepository(Ingredient);
    private riRepo = AppDataSource.getRepository(RecipeIngredient);
    private stepRepo = AppDataSource.getRepository(RecipeStep);

    @Security("jwt")
    @SuccessResponse("201", "Created")
    @Post()
    public async createRecipe(
        @Body() requestBody: RecipeCreateDto,
        @Request() req: ExpressRequest
    ): Promise<RecipeDetailResponseDto> {
        const { ingredients, steps, ...recipeData } = requestBody;
        const author = (req as any).user as User;

        const recipe = this.recipeRepo.create({ ...recipeData, user: author });
        const savedRecipe = await this.recipeRepo.save(recipe);

        if (Array.isArray(ingredients)) {
            for (const ingDto of ingredients) {
                let ingredientEntity: Ingredient;
                if (ingDto.id) {
                    ingredientEntity = await this.ingRepo.findOneByOrFail({ id: ingDto.id });
                } else {
                    const existing = await this.ingRepo.findOneBy({ name: ingDto.name });
                    ingredientEntity = existing ?? await this.ingRepo.save(this.ingRepo.create({ name: ingDto.name }));
                }

                const recipeIngredient = this.riRepo.create({
                    recipeId: savedRecipe.id,
                    ingredientId: ingredientEntity.id,
                    amount: ingDto.amount,
                });
                await this.riRepo.save(recipeIngredient);
            }
        }

        if (Array.isArray(steps)) {
            for (const stepDto of steps) {
                const step = this.stepRepo.create({
                    ...stepDto,
                    recipe: savedRecipe,
                });
                await this.stepRepo.save(step);
            }
        }

        this.setStatus(201);

        const fullRecipe = await this.recipeRepo.findOneOrFail({
            where: { id: savedRecipe.id },
            relations: ["user", "steps", "recipeIngredients", "recipeIngredients.ingredient"],
        });

        return this.toRecipeDetailDto(fullRecipe);
    }

    @Get()
    public async getRecipes(
        @Query() ingredient?: string,
        @Query() difficulty?: string
    ): Promise<RecipeListResponseDto[]> {
        const qb = this.recipeRepo.createQueryBuilder("r")
            .leftJoinAndSelect("r.user", "user")
            .leftJoin("r.recipeIngredients", "ri")
            .leftJoin("ri.ingredient", "ing");

        if (difficulty) qb.andWhere("r.difficulty = :d", { d: difficulty });
        if (ingredient) qb.andWhere("ing.name ILIKE :ing", { ing: `%${ingredient}%` });

        const recipes = await qb.getMany();
        return recipes.map(this.toRecipeListDto);
    }

    @Get("/{recipeId}")
    public async getRecipeById(@Path() recipeId: number): Promise<RecipeDetailResponseDto> {
        const recipe = await this.recipeRepo.findOne({
            where: { id: recipeId },
            relations: ["user", "steps", "recipeIngredients", "recipeIngredients.ingredient", "comments", "likes"],
        });
        if (!recipe) {
            this.setStatus(404);
            throw new Error("Recipe not found");
        }
        return this.toRecipeDetailDto(recipe);
    }

    @Security("jwt")
    @Put("/{recipeId}")
    public async updateRecipe(
        @Path() recipeId: number,
        @Body() requestBody: RecipeUpdateDto
    ): Promise<RecipeDetailResponseDto> {
        const { steps, ...data } = requestBody;
        const recipe = await this.recipeRepo.preload({ id: recipeId, ...data });
        if (!recipe) {
            this.setStatus(404);
            throw new Error("Recipe not found");
        }

        await AppDataSource.transaction(async (em) => {
            if (Array.isArray(steps)) {
                await em.delete(RecipeStep, { recipe: { id: recipeId } });
                const newSteps = steps.map((s) => {
                    const step = em.create(RecipeStep, s);
                    step.recipe = recipe;
                    return step;
                });
                recipe.steps = await em.save(newSteps);
            }
            await em.save(Recipe, recipe);
        });

        const updatedRecipe = await this.recipeRepo.findOneOrFail({
            where: { id: recipeId },
            relations: ["user", "steps", "recipeIngredients", "recipeIngredients.ingredient"],
        });
        return this.toRecipeDetailDto(updatedRecipe);
    }

    @Security("jwt")
    @Delete("/{recipeId}")
    public async deleteRecipe(@Path() recipeId: number): Promise<{ success: boolean }> {
        const result = await this.recipeRepo.delete(recipeId);
        if (!result.affected) {
            this.setStatus(404);
            throw new Error("Recipe not found");
        }
        return { success: true };
    }


    private toRecipeDetailDto(recipe: Recipe): RecipeDetailResponseDto {
        return {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            difficulty: recipe.difficulty,
            createdAt: recipe.createdAt,
            user: {
                id: recipe.user.id,
                username: recipe.user.username,
            },
            steps: recipe.steps.map(s => ({
                id: s.id,
                stepNumber: s.stepNumber,
                description: s.description,
                imageUrl: s.imageUrl,
            })),
            recipeIngredients: recipe.recipeIngredients.map(ri => ({
                amount: ri.amount,
                ingredient: {
                    id: ri.ingredient.id,
                    name: ri.ingredient.name,
                }
            })),
        };
    }

    private toRecipeListDto(recipe: Recipe): RecipeListResponseDto {
        return {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            difficulty: recipe.difficulty,
            createdAt: recipe.createdAt,
            user: {
                id: recipe.user.id,
                username: recipe.user.username,
            },
        };
    }
}