
export class RecipeStepCreateDto {
    stepNumber!: number;
    description!: string;
    imageUrl?: string;
}

export class RecipeIngredientCreateDto {
    id?: number;
    name!: string;
    amount!: string;
}

export class RecipeCreateDto {
    title!: string;
    description!: string;
    difficulty!: string;
    user!: { id: number };
    ingredients?: RecipeIngredientCreateDto[];
    steps?: RecipeStepCreateDto[];
}

export class RecipeUpdateDto {
    title?: string;
    description?: string;
    difficulty?: string;
    steps?: RecipeStepCreateDto[];
}


export class IngredientResponseDto {
    id!: number;
    name!: string;
}

export class RecipeIngredientResponseDto {
    amount!: string;
    ingredient!: IngredientResponseDto;
}

export class RecipeStepResponseDto {
    id!: number;
    stepNumber!: number;
    description!: string;
    imageUrl?: string;
}

export class RecipeDetailResponseDto {
    id!: number;
    title!: string;
    description!: string;
    difficulty!: string;
    createdAt!: Date;
    user!: { id: number; username: string };
    steps!: RecipeStepResponseDto[];
    recipeIngredients!: RecipeIngredientResponseDto[];
}

export class RecipeListResponseDto {
    id!: number;
    title!: string;
    description!: string;
    difficulty!: string;
    createdAt!: Date;
    user!: { id: number; username: string };
}