import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Recipe } from "./Recipe";

@Entity({ name: "recipe_steps" })
export class RecipeStep {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "step_number" })
    stepNumber!: number;

    @Column("text")
    description!: string;

    @Column({ name: "image_url", nullable: true })
    imageUrl?: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.steps, { onDelete: "CASCADE" })
    @JoinColumn({ name: "recipe_id" })
    recipe!: Recipe;
}