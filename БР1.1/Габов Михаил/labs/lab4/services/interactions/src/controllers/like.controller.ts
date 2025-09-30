import { Body, Controller, Delete, Post, Query, Route, SuccessResponse, Tags, Security, Request } from "tsoa";
import { AppDataSource } from "../data-source";
import { Like } from "../models";
import { LikeCreateDto } from "../dtos/like.dto";
import { getRabbitMQChannel } from "../rabbitmq-config";

@Route("likes")
@Tags("Likes")
@Security("jwt")
export class LikeController extends Controller {
    private likeRepo = AppDataSource.getRepository(Like);

    @SuccessResponse("201", "Created")
    @Post()
    public async createLike(
        @Body() requestBody: LikeCreateDto,
        @Request() request: any
    ): Promise<Like> {
        const userId = request.user.id;
        const like = this.likeRepo.create({
            userId: userId,
            recipeId: requestBody.recipeId
        });
        await this.likeRepo.save(like);
        this.setStatus(201);

        try {
            const channel = getRabbitMQChannel();
            const queue = 'interactions_events';
            const msg = {
                type: 'LikeCreated',
                data: {
                    userId: like.userId,
                    recipeId: like.recipeId
                }
            };
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(`[Interactions Service] Sent message to ${queue}:`, msg);
        } catch (error) {
            console.error('[Interactions Service] Failed to send RabbitMQ message:', error);
        }

        return like;
    }

    @Delete()
    public async deleteLike(
        @Query() recipeId: number,
        @Request() request: any
    ): Promise<{ success: boolean }> {
        const userId = request.user.id;
        const result = await this.likeRepo.delete({ userId, recipeId });
        if (result.affected === 0) {
            this.setStatus(404);
            throw new Error("Like not found");
        }
        return { success: true };
    }
}