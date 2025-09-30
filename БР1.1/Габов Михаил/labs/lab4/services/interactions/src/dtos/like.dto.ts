import { IsInt, IsPositive } from 'class-validator';

export class LikeCreateDto {
    @IsInt()
    @IsPositive()
    recipeId!: number;
}