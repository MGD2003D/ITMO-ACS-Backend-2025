import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { RecipeIngredient } from "./RecipeIngredient";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Favorite } from "./Favorite";
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

    @ManyToOne(() => User, (u) => u.recipes, { onDelete: "CASCADE" })
    user!: User;

    @OneToMany(() => RecipeStep, (step) => step.recipe, { cascade: true, eager: true })
    steps!: RecipeStep[];

    @OneToMany(() => RecipeIngredient, (ri) => ri.recipe, { cascade: true, eager: true })
    recipeIngredients!: RecipeIngredient[];

    @OneToMany(() => Comment, (c) => c.recipe)
    comments!: Comment[];

    @OneToMany(() => Like, (l) => l.recipe)
    likes!: Like[];

    @OneToMany(() => Favorite, (f) => f.recipe)
    favorites!: Favorite[];
}