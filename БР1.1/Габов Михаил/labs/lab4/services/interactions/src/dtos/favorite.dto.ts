import { IsInt, IsPositive } from 'class-validator';

export class FavoriteCreateDto {
    @IsInt()
    @IsPositive()
    userId!: number;

    @IsInt()
    @IsPositive()
    recipeId!: number;
}