import { IsInt, IsPositive } from 'class-validator';

export class LikeCreateDto {
    @IsInt()
    @IsPositive()
    userId!: number;

    @IsInt()
    @IsPositive()
    recipeId!: number;
}