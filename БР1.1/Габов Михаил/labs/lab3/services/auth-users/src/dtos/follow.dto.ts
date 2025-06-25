import { IsInt, IsPositive } from 'class-validator';

export class FollowCreateDto {
    @IsInt()
    @IsPositive()
    followerId!: number;

    @IsInt()
    @IsPositive()
    followingId!: number;
}