import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

//Create user
router.post("/", createUser);

//Admin and user themselves
router.put("/:id", requireAuth(), updateUser);
router.delete("/:id", requireAuth(), deleteUser);

// Admin only. Would be secured with authentication
router.get("/", requireAuth(), requireAdmin, getAllUsers);
router.get("/:id", requireAuth(), requireAdmin, getUserById);

export default router;
