import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { Follow } from "../models";

const foRepo = AppDataSource.getRepository(Follow);

export const createFollow: RequestHandler<{}, any, { followerId: number; followingId: number }> = async (
    req,
    res
) => {
    try {
        const follow = foRepo.create(req.body);
        await foRepo.save(follow);
        res.status(201).json(follow);
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ message: err.message ?? "Unknown error" });
    }
    return;
};

export const deleteFollow: RequestHandler<{}, any, any, { followerId?: string; followingId?: string }> = async (
    req,
    res
) => {
    const { followerId, followingId } = req.query;
    if (!followerId || !followingId) {
        res.status(400).json({ message: "followerId and followingId query params required" });
        return;
    }
    const result = await foRepo.delete({
        followerId: Number(followerId),
        followingId: Number(followingId),
    });
    if (result.affected) res.json({ success: true });
    else res.status(404).json({ message: "Not found" });
    return;
};
