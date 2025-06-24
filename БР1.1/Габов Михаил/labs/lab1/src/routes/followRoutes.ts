import { Router } from "express";
import { createFollow, deleteFollow } from "../controllers/followController";

const router = Router();
router.post("/", createFollow);
router.delete("/", deleteFollow);

export default router;
