import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "favorites" })
export class Favorite {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "recipe_id" })
    recipeId!: number;

    @Column({ name: "user_id" })
    userId!: number;
}