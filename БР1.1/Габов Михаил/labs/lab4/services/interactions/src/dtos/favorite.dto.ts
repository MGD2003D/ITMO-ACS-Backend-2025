import { IsInt, IsPositive } from 'class-validator';

export class FavoriteCreateDto {
    @IsInt()
    @IsPositive()
    recipeId!: number;
}