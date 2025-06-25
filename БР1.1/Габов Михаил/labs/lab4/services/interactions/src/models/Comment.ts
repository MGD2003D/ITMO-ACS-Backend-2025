import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity({ name: "comments" })
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    content!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @Column({ name: "recipe_id" })
    recipeId!: number;

    @Column({ name: "user_id" })
    userId!: number;
}