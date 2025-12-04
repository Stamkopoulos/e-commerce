import Router from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
} from "../controllers/orderController.js";

const router = Router();

router.post("/", createOrder);

router.get("/:id", getOrderById);

router.get("/user/:userId", getOrdersByUser);

//Admin only
router.get("/", getAllOrders);

export default router;
