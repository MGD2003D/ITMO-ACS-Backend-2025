import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from "typeorm";
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
    @JoinColumn({ name: "recipe_id" })
    recipe!: Recipe;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.id, {
        eager: true,
        onDelete: "RESTRICT",
    })
    @JoinColumn({ name: "ingredient_id" })
    ingredient!: Ingredient;
}