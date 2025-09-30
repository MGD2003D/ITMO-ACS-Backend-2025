import { Body, Controller, Delete, Post, Query, Route, SuccessResponse, Tags, Security, Request } from "tsoa";
import { AppDataSource } from "../data-source";
import { Favorite } from "../models";
import { FavoriteCreateDto } from "../dtos/favorite.dto";
import { getRabbitMQChannel } from "../rabbitmq-config";

@Route("favorites")
@Tags("Favorites")
@Security("jwt")
export class FavoriteController extends Controller {
    private favRepo = AppDataSource.getRepository(Favorite);

    @SuccessResponse("201", "Created")
    @Post()
    public async createFavorite(
        @Body() requestBody: FavoriteCreateDto,
        @Request() request: any
    ): Promise<Favorite> {
        const userId = request.user.id;
        const favorite = this.favRepo.create({
            userId: userId,
            recipeId: requestBody.recipeId
        });
        await this.favRepo.save(favorite);
        this.setStatus(201);

        try {
            const channel = getRabbitMQChannel();
            const queue = 'interactions_events';
            const msg = {
                type: 'FavoriteCreated',
                data: {
                    userId: favorite.userId,
                    recipeId: favorite.recipeId
                }
            };
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(`[Interactions Service] Sent message to ${queue}:`, msg);
        } catch (error) {
            console.error('[Interactions Service] Failed to send RabbitMQ message:', error);
        }

        return favorite;
    }

    @Delete()
    public async deleteFavorite(
        @Query() recipeId: number,
        @Request() request: any
    ): Promise<{ success: boolean }> {
        const userId = request.user.id;
        const result = await this.favRepo.delete({ userId, recipeId });
        if (result.affected === 0) {
            this.setStatus(404);
            throw new Error("Favorite not found");
        }
        return { success: true };
    }
}