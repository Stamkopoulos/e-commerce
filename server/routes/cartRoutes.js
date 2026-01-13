import { Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = Router();

router.get("/", requireAuth(), getCart);
router.post("/", requireAuth(), addToCart);
router.patch("/:itemId", requireAuth(), removeFromCart);
router.put("/", requireAuth(), clearCart);

export default router;
