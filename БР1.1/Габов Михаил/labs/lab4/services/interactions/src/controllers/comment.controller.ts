import {
    Body, Controller, Delete, Get, Path, Post, Query, Route, SuccessResponse, Tags, Security, Request, NoSecurity
} from "tsoa";
import { AppDataSource } from "../data-source";
import { Comment } from "../models";
import { CommentCreateDto, CommentResponseDto } from "../dtos/comment.dto";
import { getRabbitMQChannel } from "../rabbitmq-config";

@Route("comments")
@Tags("Comments")
@Security("jwt")
export class CommentController extends Controller {
    private commentRepo = AppDataSource.getRepository(Comment);

    @SuccessResponse("201", "Created")
    @Post()
    public async createComment(
        @Body() requestBody: CommentCreateDto,
        @Request() request: any
    ): Promise<CommentResponseDto> {
        const userId = request.user.id;

        const newCommentData = {
            content: requestBody.content,
            recipeId: requestBody.recipeId,
            userId: userId,
        };

        const comment = this.commentRepo.create(newCommentData);
        await this.commentRepo.save(comment);
        this.setStatus(201);

        try {
            const channel = getRabbitMQChannel();
            const queue = 'interactions_events';
            const msg = {
                type: 'CommentCreated',
                data: {
                    commentId: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    recipeId: comment.recipeId
                }
            };
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(`[Interactions Service] Sent message to ${queue}:`, msg);
        } catch (error) {
            console.error('[Interactions Service] Failed to send RabbitMQ message:', error);
        }

        return this.toCommentResponseDto(comment);
    }

    @NoSecurity()
    @Get()
    public async getCommentsByRecipe(@Query() recipeId: number): Promise<CommentResponseDto[]> {
        const comments = await this.commentRepo.find({
            where: { recipeId: recipeId },
            order: { createdAt: 'ASC' }
        });
        return comments.map(this.toCommentResponseDto);
    }

        @Delete("/{commentId}")
    public async deleteComment(
        @Path() commentId: number,
        @Request() request: any
    ): Promise<{ success: boolean }> {
        const comment = await this.commentRepo.findOneBy({ id: commentId });
        if (!comment) {
            this.setStatus(404);
            throw new Error("Comment not found");
        }

        if (comment.userId !== request.user.id) {
            this.setStatus(403);
            throw new Error("User is not authorized to delete this comment");
        }

        const result = await this.commentRepo.delete(commentId);
        if (result.affected === 0) {
            this.setStatus(404);
            throw new Error("Comment not found during deletion");
        }
        return { success: true };
    }

    private toCommentResponseDto(comment: Comment): CommentResponseDto {
        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            user: {
                id: comment.userId,
                username: `user_${comment.userId}`,
                avatarUrl: undefined,
            },
        };
    }
}