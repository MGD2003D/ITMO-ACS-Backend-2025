import { Body, Controller, Delete, Post, Query, Route, SuccessResponse, Tags } from "tsoa";
import { AppDataSource } from "../data-source";
import { Favorite } from "../models";
import { FavoriteCreateDto } from "../dtos/favorite.dto";

@Route("favorites")
@Tags("Favorites")
export class FavoriteController extends Controller {
    private favRepo = AppDataSource.getRepository(Favorite);

    @SuccessResponse("201", "Created")
    @Post()
    public async createFavorite(@Body() requestBody: FavoriteCreateDto): Promise<Favorite> {
        const favorite = this.favRepo.create({
            userId: requestBody.userId,
            recipeId: requestBody.recipeId
        });
        await this.favRepo.save(favorite);
        this.setStatus(201);
        return favorite;
    }

    @Delete()
    public async deleteFavorite(
        @Query() userId: number,
        @Query() recipeId: number
    ): Promise<{ success: boolean }> {
        const result = await this.favRepo.delete({ userId, recipeId });
        if (result.affected === 0) {
            this.setStatus(404);
            throw new Error("Favorite not found");
        }
        return { success: true };
    }
}