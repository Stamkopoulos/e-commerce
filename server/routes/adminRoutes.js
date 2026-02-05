import { Router } from "express";

import { requireAdmin } from "../middlewares/requireAdmin.js";
import { requireAuth } from "@clerk/express";

import {
  getDashboardOverview,
  getAdminProducts,
  getAdminOrders,
  getAdminUsers,
  //   createDiscount,
  //   getDiscounts,
  //   updateDiscount,
  //   deleteDiscount,
  //   getSettings,
  //   updateSettings
} from "../controllers/adminController.js";

const router = Router();

router.get(
  "/dashboard/overview",
  requireAuth(),
  requireAdmin,
  getDashboardOverview,
);

router.get("/products", requireAuth(), requireAdmin, getAdminProducts);

router.get("/orders", requireAuth(), requireAdmin, getAdminOrders);

router.get("/users", requireAuth(), requireAdmin, getAdminUsers);

// //Discounts
// router.post("/discounts", requireAuth(), requireAdmin,createDiscount);
// router.get("/discounts", requireAuth(), requireAdmin,, getDiscounts);
// router.put("/discounts/:id", requireAuth(), requireAdmin, updateDiscount);
// router.delete("/discounts/:id",, requireAuth(), requireAdmin, deleteDiscount);

// //Settings
// router.get("/settings", requireAuth(), requireAdmin, getSettings);
// router.put("/settings", requireAuth(), requireAdmin,updateSettings);

export default router;
