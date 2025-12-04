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
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

// Admin only. Would be secured with authentication
router.get("/", getAllUsers);

export default router;
