import {
    Entity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "follows" })
export class Follow {
    @PrimaryColumn({ name: "follower_id" })
    followerId!: number;

    @PrimaryColumn({ name: "following_id" })
    followingId!: number;

    @ManyToOne(() => User, (user) => user.following, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "follower_id" })
    follower!: User;

    @ManyToOne(() => User, (user) => user.followers, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "following_id" })
    following!: User;
}
