import { IsNotEmpty, IsString } from 'class-validator';

export class CommentCreateDto {
    @IsNotEmpty({ message: 'Текст комментария не может быть пустым' })
    @IsString()
    content!: string;

    recipeId!: number;
}

export class CommentResponseDto {
    id!: number;
    content!: string;
    createdAt!: Date;
    user!: {
        id: number;
        username: string;
        avatarUrl?: string;
    };
}