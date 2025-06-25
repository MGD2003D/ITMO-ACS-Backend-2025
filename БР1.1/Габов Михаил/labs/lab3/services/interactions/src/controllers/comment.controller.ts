import {
    Body, Controller, Delete, Get, Path, Post, Query, Route, SuccessResponse, Tags
} from "tsoa";
import { AppDataSource } from "../data-source";
import { Comment } from "../models";
import { CommentCreateDto, CommentResponseDto } from "../dtos/comment.dto";

@Route("comments")
@Tags("Comments")
export class CommentController extends Controller {
    private commentRepo = AppDataSource.getRepository(Comment);

    @SuccessResponse("201", "Created")
    @Post()
    public async createComment(
        @Body() requestBody: CommentCreateDto,
    ): Promise<CommentResponseDto> {
        // @ts-ignore
        const userId = requestBody.userId;
        if (!userId) {
            this.setStatus(400);
            throw new Error("User ID must be provided.");
        }

        const newCommentData = {
            content: requestBody.content,
            recipeId: requestBody.recipeId,
            userId: userId,
        };

        const comment = this.commentRepo.create(newCommentData);
        await this.commentRepo.save(comment);
        this.setStatus(201);
        return this.toCommentResponseDto(comment);
    }

    @Get()
    public async getCommentsByRecipe(@Query() recipeId: number): Promise<CommentResponseDto[]> {
        const comments = await this.commentRepo.find({
            where: { recipeId: recipeId },
            order: { createdAt: 'ASC' }
        });
        return comments.map(this.toCommentResponseDto);
    }

    @Delete("/{commentId}")
    public async deleteComment(@Path() commentId: number): Promise<{ success: boolean }> {
        const result = await this.commentRepo.delete(commentId);
        if (result.affected === 0) {
            this.setStatus(404);
            throw new Error("Comment not found");
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