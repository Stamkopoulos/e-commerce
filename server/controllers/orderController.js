import Order from "../models/Order.js";
import User from "../models/User.js";
import { getAuth } from "@clerk/express";
import { decreaseStock } from "../services/stockService.js";

//Create a new order
export const createOrder = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    //const userId = req.auth.userId; //its the same

    let user = null;
    if (userId) {
      user = await User.findOne({ clerkId: userId }); //Find user from clerkId
    }

    const {
      customerFirstName,
      customerLastName,
      email,
      phone,
      address,
      zipCode,
      items,
      totalPrice,
      /*status,
      paymentStatus,*/
    } = req.body;

    const newOrder = await Order.create({
      user: user ? user._id : null, //If (mongo)user exists, store their _id, if not exists store null
      customerFirstName,
      customerLastName,
      email,
      phone,
      address,
      zipCode,
      items,
      totalPrice,
      /*status,
        paymentStatus,*/
    });

    //Decrease stock for each item
    for (const item of items) {
      const { productId, color, size, quantity } = item;
      await decreaseStock({ productId, color, size, quantity });
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by user ID - get orders of logged-in user
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orders = await Order.find({ user: user._id }).populate(
      "user",
      "name email"
    );

    if (!orders) {
      return res.status(404).json({ error: "Orders not found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status / payment (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status, paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete an order (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
