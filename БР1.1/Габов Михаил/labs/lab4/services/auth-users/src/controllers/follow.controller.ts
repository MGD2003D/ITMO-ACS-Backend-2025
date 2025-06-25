import { Body, Controller, Delete, Post, Query, Route, Security, SuccessResponse, Tags } from "tsoa";
import { AppDataSource } from "../data-source";
import { Follow } from "../models";
import { FollowCreateDto } from "../dtos/follow.dto";

@Route("follows")
@Tags("Follows")
@Security("jwt")
export class FollowController extends Controller {
    private foRepo = AppDataSource.getRepository(Follow);

    @SuccessResponse("201", "Created")
    @Post()
    public async createFollow(@Body() requestBody: FollowCreateDto): Promise<Follow> {
        const follow = this.foRepo.create(requestBody);
        await this.foRepo.save(follow);
        this.setStatus(201);
        return follow;
    }

    @Delete()
    public async deleteFollow(
        @Query() followerId: number,
        @Query() followingId: number
    ): Promise<{ success: boolean }> {
        const result = await this.foRepo.delete({
            followerId,
            followingId,
        });

        if (result.affected === 0) {
            this.setStatus(404);
            throw new Error("Follow relationship not found");
        }
        return { success: true };
    }
}