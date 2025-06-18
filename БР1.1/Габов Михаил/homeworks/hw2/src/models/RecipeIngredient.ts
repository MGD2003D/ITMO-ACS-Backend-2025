import { Entity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import { Recipe } from "./Recipe";
import { Ingredient } from "./Ingredient";

@Entity({ name: "recipe_ingredients" })
export class RecipeIngredient {
    @PrimaryColumn({ name: "recipe_id" })
    recipeId!: number;

    @PrimaryColumn({ name: "ingredient_id" })
    ingredientId!: number;

    @Column()
    amount!: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, {
        onDelete: "CASCADE",
    })
    recipe!: Recipe;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.id, {
        eager: true,
        onDelete: "CASCADE",
    })
    ingredient!: Ingredient;
}