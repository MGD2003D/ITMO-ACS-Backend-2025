import {
    Body, Controller, Delete, Get, Path, Post, Put, Query, Route, SuccessResponse, Tags, Res, TsoaResponse,
    Security, Request,
    NoSecurity
} from "tsoa";
import { AppDataSource } from "../data-source";
import { Ingredient, Recipe, RecipeIngredient, RecipeStep } from "../models";
import {
    RecipeCreateDto, RecipeDetailResponseDto, RecipeListResponseDto, RecipeUpdateDto
} from "../dtos/recipe.dto";
import { getRabbitMQChannel } from '../rabbitmq-config';
import axios from 'axios';

@Route("recipes")
@Tags("Recipes")
@Security("jwt")
export class RecipeController extends Controller {
    private recipeRepo = AppDataSource.getRepository(Recipe);
    private ingRepo = AppDataSource.getRepository(Ingredient);
    private riRepo = AppDataSource.getRepository(RecipeIngredient);
    private stepRepo = AppDataSource.getRepository(RecipeStep);

@SuccessResponse("201", "Created")
@Post()
public async createRecipe(
    @Body() requestBody: RecipeCreateDto,
    @Request() request: any
): Promise<RecipeDetailResponseDto> {
    
    
    const userId = request.user.id;
    const { ingredients, steps, ...recipeData } = requestBody;
    
    const recipe = this.recipeRepo.create({ ...recipeData, userId: userId });
    const savedRecipe = await this.recipeRepo.save(recipe);

    const savedRecipeIngredients: RecipeIngredient[] = [];
    const savedSteps: RecipeStep[] = [];

    if (Array.isArray(ingredients)) {
        for (const ingDto of ingredients) {
            const ingredientEntity = await this.ingRepo.findOneByOrFail({ id: ingDto.id });

            const recipeIngredient = this.riRepo.create({
                recipeId: savedRecipe.id,
                ingredientId: ingredientEntity.id,
                amount: ingDto.amount,
            });
            const savedRi = await this.riRepo.save(recipeIngredient);
            
            savedRi.ingredient = ingredientEntity;
            savedRecipeIngredients.push(savedRi);
        }
    }

        if (Array.isArray(steps)) {
            for (const stepDto of steps) {
                const step = this.stepRepo.create({
                    ...stepDto,
                    recipe: savedRecipe,
                });
                const savedStep = await this.stepRepo.save(step);
                savedSteps.push(savedStep);
            }
        }
        
        try {
            const rabbitMQChannel = getRabbitMQChannel();
            const queue = 'new_recipe_events';
            const msg = JSON.stringify({
                type: 'RecipeCreated',
                recipeId: savedRecipe.id,
                title: savedRecipe.title,
                userId: savedRecipe.userId,
            });
            rabbitMQChannel.sendToQueue(queue, Buffer.from(msg));
            console.log(`[Recipes Service] Sent message to ${queue}`);
        } catch (error) {
            console.error('[Recipes Service] Failed to send message:', error);
        }

        this.setStatus(201);
        
        const username = await this.fetchUsername(savedRecipe.userId);
        
        return {
            id: savedRecipe.id,
            title: savedRecipe.title,
            description: savedRecipe.description,
            difficulty: savedRecipe.difficulty,
            createdAt: savedRecipe.createdAt,
            user: {
                id: savedRecipe.userId,
                username: username,
            },
            steps: savedSteps.map(s => ({
                id: s.id,
                stepNumber: s.stepNumber,
                description: s.description,
                imageUrl: s.imageUrl,
            })),
            recipeIngredients: savedRecipeIngredients.map(ri => ({
                amount: ri.amount,
                ingredient: {
                    id: ri.ingredient.id,
                    name: ri.ingredient.name,
                }
            })),
        };
    }

    @Get()
    @NoSecurity()
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
    @NoSecurity()
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
        @Body() requestBody: RecipeUpdateDto,
        @Request()request: any
    ): Promise<RecipeDetailResponseDto> {
        const { steps, ...data } = requestBody;
        const recipe = await this.recipeRepo.preload({ id: recipeId, ...data });
        if (!recipe) {
            this.setStatus(404);
            throw new Error("Recipe not found");
        }

        if (recipe.userId !== request.user.id) {
            this.setStatus(403);
            throw new Error("User is not authorized to update this recipe");
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
        return await this.toRecipeDetailDto(updatedRecipe);
    }

    @Delete("/{recipeId}")
    public async deleteRecipe(@Path() recipeId: number, @Request() request: any): Promise<{ success: boolean }> {


        const recipe = await this.recipeRepo.findOneBy({ id: recipeId });
        if (!recipe) {
            this.setStatus(404);
            throw new Error("Recipe not found");
        }
        
        if (recipe.userId !== request.user.id) {
            this.setStatus(403);
            throw new Error("User is not authorized to delete this recipe");
        }

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