import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
} from "typeorm";
import { RecipeIngredient } from "./RecipeIngredient";
import { RecipeStep } from "./RecipeStep";

@Entity({ name: "recipes" })
export class Recipe {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ type: "text" })
    description!: string;

    @Column()
    difficulty!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @Column({ name: "user_id" })
    userId!: number;

    @OneToMany(() => RecipeStep, (step) => step.recipe, { cascade: true, eager: true })
    steps!: RecipeStep[];

    @OneToMany(() => RecipeIngredient, (ri) => ri.recipe, { cascade: true, eager: true })
    recipeIngredients!: RecipeIngredient[];

}