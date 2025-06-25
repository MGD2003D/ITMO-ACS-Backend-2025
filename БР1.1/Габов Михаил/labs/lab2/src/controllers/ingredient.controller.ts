import {
    Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags
} from "tsoa";
import { AppDataSource } from "../data-source";
import { Ingredient } from "../models";
import { IngredientCreateDto, IngredientDto, IngredientUpdateDto } from "../dtos/ingredient.dto";

@Route("ingredients")
@Tags("Ingredients")
export class IngredientController extends Controller {
    private repo = AppDataSource.getRepository(Ingredient);

    @SuccessResponse("201", "Created")
    @Post()
    public async createIngredient(@Body() requestBody: IngredientCreateDto): Promise<IngredientDto> {
        const ingredient = this.repo.create(requestBody);
        await this.repo.save(ingredient);
        this.setStatus(201);
        return this.toIngredientDto(ingredient);
    }

    @Get()
    public async getAllIngredients(): Promise<IngredientDto[]> {
        const items = await this.repo.find();
        return items.map(this.toIngredientDto);
    }

    @Get("/{ingredientId}")
    public async getIngredientById(@Path() ingredientId: number): Promise<IngredientDto> {
        const ingredient = await this.repo.findOneBy({ id: ingredientId });
        if (!ingredient) {
            this.setStatus(404);
            throw new Error("Ingredient not found");
        }
        return this.toIngredientDto(ingredient);
    }

    @Put("/{ingredientId}")
    public async updateIngredient(
        @Path() ingredientId: number,
        @Body() requestBody: IngredientUpdateDto
    ): Promise<IngredientDto> {
        const ingredient = await this.repo.preload({ id: ingredientId, ...requestBody });
        if (!ingredient) {
            this.setStatus(404);
            throw new Error("Ingredient not found");
        }
        await this.repo.save(ingredient);
        return this.toIngredientDto(ingredient);
    }

    @Delete("/{ingredientId}")
    public async deleteIngredient(@Path() ingredientId: number): Promise<{ success: boolean }> {
        const result = await this.repo.delete(ingredientId);
        if (result.affected === 0) {
            this.setStatus(404);
            throw new Error("Ingredient not found");
        }
        return { success: true };
    }

    private toIngredientDto(ingredient: Ingredient): IngredientDto {
        return {
            id: ingredient.id,
            name: ingredient.name
        };
    }
}