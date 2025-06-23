import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    Index,
} from "typeorm";
import { Recipe } from "./Recipe";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Favorite } from "./Favorite";
import { Follow } from "./Follow";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Index()
    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ name: "avatar_url", nullable: true })
    avatarUrl?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    /** relations */
    @OneToMany(() => Recipe, (recipe) => recipe.user)
    recipes!: Recipe[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment[];

    @OneToMany(() => Like, (like) => like.user)
    likes!: Like[];

    @OneToMany(() => Favorite, (fav) => fav.user)
    favorites!: Favorite[];

    @OneToMany(() => Follow, (f) => f.follower)
    following!: Follow[];

    @OneToMany(() => Follow, (f) => f.following)
    followers!: Follow[];
}