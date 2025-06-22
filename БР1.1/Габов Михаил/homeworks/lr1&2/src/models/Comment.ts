import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Recipe } from "./Recipe";

@Entity({ name: "comments" })
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    content!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @ManyToOne(() => Recipe, (recipe) => recipe.comments, { onDelete: "CASCADE" })
    recipe!: Recipe;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
    user!: User;
}
