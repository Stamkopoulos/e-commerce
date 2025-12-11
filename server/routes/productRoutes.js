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
import Product from "../models/Product.js";

const router = Router();

//Public
router.get("/", getAllProducts);

router.get("/collections/:gender", async (req, res) => {
  const { gender } = req.params;
  try {
    const products = await Product.find({ gender });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:id", getProductById);

//Admin only. Would be secured with authentication
router.post("/", requireAuth(), requireAdmin, createProduct);
router.put("/:id", requireAuth(), requireAdmin, updateProduct);
router.delete("/:id", requireAuth(), requireAdmin, deleteProduct);

export default router;
