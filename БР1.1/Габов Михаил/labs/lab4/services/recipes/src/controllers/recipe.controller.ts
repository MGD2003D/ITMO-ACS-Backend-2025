// lab4/services/recipes/src/controllers/recipe.controller.ts
import {
    Body, Controller, Delete, Get, Path, Post, Put, Query, Route, SuccessResponse, Tags, Res, TsoaResponse
} from "tsoa";
import { AppDataSource } from "../data-source";
import { Ingredient, Recipe, RecipeIngredient, RecipeStep } from "../models";
import {
    RecipeCreateDto, RecipeDetailResponseDto, RecipeListResponseDto, RecipeUpdateDto
} from "../dtos/recipe.dto";
import { Channel } from 'amqplib';
import { rabbitMQChannel } from '../index';
import axios from 'axios';

@Route("recipes")
@Tags("Recipes")
export class RecipeController extends Controller {
    private recipeRepo = AppDataSource.getRepository(Recipe);
    private ingRepo = AppDataSource.getRepository(Ingredient);
    private riRepo = AppDataSource.getRepository(RecipeIngredient);
    private stepRepo = AppDataSource.getRepository(RecipeStep);

    @SuccessResponse("201", "Created")
    @Post()
    public async createRecipe(
        @Body() requestBody: RecipeCreateDto,
        @Res() res: TsoaResponse<400 | 500, { message: string }>
    ): Promise<RecipeDetailResponseDto> {
        const { ingredients, steps, user, ...recipeData } = requestBody;

        if (!user || !user.id) {
            this.setStatus(400);
            throw new Error("User ID must be provided in the request body.");
        }

        const recipe = this.recipeRepo.create({ ...recipeData, userId: user.id });
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
            relations: ["steps", "recipeIngredients", "recipeIngredients.ingredient"],
        });

        if (rabbitMQChannel) {
            const queue = 'new_recipe_events';
            const msg = JSON.stringify({
                type: 'RecipeCreated',
                recipeId: savedRecipe.id,
                title: savedRecipe.title,
                userId: savedRecipe.userId,
                createdAt: savedRecipe.createdAt,
            });
            await rabbitMQChannel.assertQueue(queue, { durable: true });
            rabbitMQChannel.sendToQueue(queue, Buffer.from(msg));
            console.log(`[Recipes Service] Sent message to ${queue}: ${msg}`);
        } else {
            console.warn('[Recipes Service] RabbitMQ channel not available. Message for new recipe not sent.');
        }

        return await this.toRecipeDetailDto(fullRecipe);
    }

    @Get()
    public async getRecipes(
        @Query() ingredient?: string,
        @Query() difficulty?: string
    ): Promise<RecipeListResponseDto[]> {
        const qb = this.recipeRepo.createQueryBuilder("r")
            .leftJoin("r.recipeIngredients", "ri")
            .leftJoin("ri.ingredient", "ing");

        if (difficulty) qb.andWhere("r.difficulty = :d", { d: difficulty });
        if (ingredient) qb.andWhere("ing.name ILIKE :ing", { ing: `%${ingredient}%` });

        const recipes = await qb.getMany();
        return await Promise.all(recipes.map(r => this.toRecipeListDto(r)));
    }

    @Get("/{recipeId}")
    public async getRecipeById(@Path() recipeId: number): Promise<RecipeDetailResponseDto> {
        const recipe = await this.recipeRepo.findOne({
            where: { id: recipeId },
            relations: ["steps", "recipeIngredients", "recipeIngredients.ingredient"],
        });
        if (!recipe) {
            this.setStatus(404);
            throw new Error("Recipe not found");
        }
        return await this.toRecipeDetailDto(recipe);
    }

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
            relations: ["steps", "recipeIngredients", "recipeIngredients.ingredient"],
        });
        return await this.toRecipeDetailDto(updatedRecipe); // ДОБАВИТЬ await
    }

    @Delete("/{recipeId}")
    public async deleteRecipe(@Path() recipeId: number): Promise<{ success: boolean }> {
        const result = await this.recipeRepo.delete(recipeId);
        if (!result.affected) {
            this.setStatus(404);
            throw new Error("Recipe not found");
        }
        return { success: true };
    }

    private async fetchUsername(userId: number): Promise<string> {
        try {
            const response = await axios.get(`http://auth-users-service:3001/users/search/by?id=${userId}`);
            return response.data.username;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`[Recipes Service] Failed to fetch username for userId ${userId}:`, error.message);
            } else {
                console.error(`[Recipes Service] Failed to fetch username for userId ${userId}:`, error);
            }
            return "Unknown User";
        }
    }

    private async toRecipeDetailDto(recipe: Recipe): Promise<RecipeDetailResponseDto> {
        const username = await this.fetchUsername(recipe.userId);
        return {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            difficulty: recipe.difficulty,
            createdAt: recipe.createdAt,
            user: {
                id: recipe.userId,
                username: username,
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

    private async toRecipeListDto(recipe: Recipe): Promise<RecipeListResponseDto> {
        const username = await this.fetchUsername(recipe.userId);
        return {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            difficulty: recipe.difficulty,
            createdAt: recipe.createdAt,
            user: {
                id: recipe.userId,
                username: username,
            },
        };
    }
}