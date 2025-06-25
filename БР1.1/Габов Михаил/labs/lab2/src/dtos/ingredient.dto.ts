import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class IngredientCreateDto {
    @IsNotEmpty({ message: 'Название ингредиента не может быть пустым' })
    @IsString()
    name!: string;
}

export class IngredientUpdateDto {
    @IsOptional()
    @IsNotEmpty({ message: 'Название ингредиента не может быть пустым' })
    @IsString()
    name?: string;
}

export class IngredientDto {
    id!: number;
    name!: string;
}