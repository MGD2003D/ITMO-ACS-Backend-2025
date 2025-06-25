import {
    Body, Controller, Delete, Get, Path, Post, Query, Request, Route, Security, SuccessResponse, Tags
} from "tsoa";
import { AppDataSource } from "../data-source";
import { Comment, Recipe, User } from "../models";
import { CommentCreateDto, CommentResponseDto } from "../dtos/comment.dto";
import { Request as ExpressRequest } from "express";

@Route("comments")
@Tags("Comments")
export class CommentController extends Controller {
    private commentRepo = AppDataSource.getRepository(Comment);

    @Security("jwt")
    @SuccessResponse("201", "Created")
    @Post()
    public async createComment(
        @Body() requestBody: CommentCreateDto,
        @Request() req: ExpressRequest
    ): Promise<CommentResponseDto> {
        const author = (req as any).user as User;
        const { content, recipeId } = requestBody;

        if (!content || !recipeId) {
            this.setStatus(400);
            throw new Error("Content and recipeId are required");
        }

        const newCommentData = {
            content,
            recipe: { id: recipeId } as Recipe,
            user: author,
        };

        const comment = this.commentRepo.create(newCommentData);
        await this.commentRepo.save(comment);
        this.setStatus(201);

        const fullComment = await this.commentRepo.findOneOrFail({
            where: { id: comment.id },
            relations: ["user"]
        });

        return this.toCommentResponseDto(fullComment);
    }

    @Get()
    public async getCommentsByRecipe(@Query() recipeId: number): Promise<CommentResponseDto[]> {
        const comments = await this.commentRepo.find({
            where: { recipe: { id: recipeId } },
            relations: ["user"],
            order: { createdAt: 'ASC' }
        });

        return comments.map(this.toCommentResponseDto);
    }

    @Security("jwt")
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
                id: comment.user.id,
                username: comment.user.username,
                avatarUrl: comment.user.avatarUrl,
            },
        };
    }
}