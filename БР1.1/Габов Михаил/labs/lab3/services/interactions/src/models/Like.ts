import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "likes" })
export class Like {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "recipe_id" })
    recipeId!: number;

    @Column({ name: "user_id" })
    userId!: number;
}