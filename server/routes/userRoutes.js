import { Router } from "express";

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
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Admin only. Would be secured with authentication
router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
