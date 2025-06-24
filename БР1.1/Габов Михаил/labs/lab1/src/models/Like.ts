import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Recipe } from "./Recipe";
import { User } from "./User";

@Entity({ name: "likes" })
export class Like {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Recipe, (recipe) => recipe.likes, { onDelete: "CASCADE" })
    recipe!: Recipe;

    @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
    user!: User;
}