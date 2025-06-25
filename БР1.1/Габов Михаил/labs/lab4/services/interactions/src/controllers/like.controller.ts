import { Body, Controller, Delete, Post, Query, Route, SuccessResponse, Tags } from "tsoa";
import { AppDataSource } from "../data-source";
import { Like } from "../models";
import { LikeCreateDto } from "../dtos/like.dto";

@Route("likes")
@Tags("Likes")
export class LikeController extends Controller {
    private likeRepo = AppDataSource.getRepository(Like);

    @SuccessResponse("201", "Created")
    @Post()
    public async createLike(@Body() requestBody: LikeCreateDto): Promise<Like> {
        const like = this.likeRepo.create({
            userId: requestBody.userId,
            recipeId: requestBody.recipeId
        });
        await this.likeRepo.save(like);
        this.setStatus(201);
        return like;
    }

    @Delete()
    public async deleteLike(
        @Query() userId: number,
        @Query() recipeId: number
    ): Promise<{ success: boolean }> {
        const result = await this.likeRepo.delete({ userId, recipeId });
        if (result.affected === 0) {
            this.setStatus(404);
            throw new Error("Like not found");
        }
        return { success: true };
    }
}