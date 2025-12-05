import Router from "express";
import { requireAuth } from "@clerk/express";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = Router();

router.post("/", createOrder); //Dont need auth if can order as guest

router.get("/user/:userId", requireAuth(), getOrdersByUser);

router.get("/:id", getOrderById); //dont know yet if need auth to view specific order

//Admin only
router.get("/", requireAuth(), requireAdmin, getAllOrders);
router.put("/:id", requireAuth(), requireAdmin, updateOrderStatus);
router.delete("/:id", requireAuth(), requireAdmin, deleteOrder);

export default router;
