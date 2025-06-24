import { Router } from "express";
import {
    createUser,
    getAllUsers,
    searchUser,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
} from "../controllers/userController";

const router = Router();
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/search/by", searchUser);

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.post("/login", loginUser);
import { protect } from "../middleware/authMiddleware";
router.get("/", protect, getAllUsers);
router.get("/search/by", protect, searchUser);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);
export default router;
