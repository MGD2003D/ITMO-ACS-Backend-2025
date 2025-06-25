import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    Index,
} from "typeorm";
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

    @OneToMany(() => Follow, (f) => f.follower)
    following!: Follow[];

    @OneToMany(() => Follow, (f) => f.following)
    followers!: Follow[];

}