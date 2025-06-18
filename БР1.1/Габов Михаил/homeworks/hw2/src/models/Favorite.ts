import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Recipe } from "./Recipe";
import { User } from "./User";

@Entity({ name: "favorites" })
export class Favorite {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Recipe, (recipe) => recipe.favorites, {
        onDelete: "CASCADE",
    })
    recipe!: Recipe;

    @ManyToOne(() => User, (user) => user.favorites, { onDelete: "CASCADE" })
    user!: User;
}
