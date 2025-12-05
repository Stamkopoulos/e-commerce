import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

//Public
router.get("/", getAllProducts);
router.get("/:id", getProductById);

//Admin only. Would be secured with authentication
router.post("/", requireAuth(), requireAdmin, createProduct);
router.put("/:id", requireAuth(), requireAdmin, updateProduct);
router.delete("/:id", requireAuth(), requireAdmin, deleteProduct);

export default router;
