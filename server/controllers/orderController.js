import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { getAuth } from "@clerk/express";
import { decreaseStock } from "../services/stockService.js";

//Create a new order
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = getAuth(req);
    //const userId = req.auth.userId; //its the same

    let user = null;
    let cart = null;
    let items = [];

    //Find user only if logged in
    if (userId) {
      user = await User.findOne({ clerkId: userId });
    }

    const {
      customerFirstName,
      customerLastName,
      email,
      phone,
      address,
      zipCode,
      //items,
      //totalPrice,
      /*status,
      paymentStatus,*/
    } = req.body;

    if (
      !customerFirstName ||
      !customerLastName ||
      !email ||
      !phone ||
      !address ||
      !zipCode
    ) {
      throw new Error("Missing customer information");
    }

    if (user) {
      cart = await Cart.findOne({ user: user._id })
        .populate("items.product")
        .session(session);

      items = cart.items.map((item) => {
        const productId =
          typeof item.product === "object" ? item.product._id : item.product;

        const name =
          typeof item.product === "object" ? item.product.name : item.name;

        const price = item.price;

        if (!productId || !name || price == null) {
          throw new Error("Invalid cart item data");
        }

        return {
          productId,
          name,
          price,
          quantity: item.quantity,
          color: item.color || null,
          size: item.size || null,
        };
      });
    }
    // Guest user: get items from request body
    else {
      if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
        throw new Error("Cart is empty");
      }
      items = req.body.items;
    }
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const [newOrder] = await Order.create(
      [
        {
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
        },
      ],
      { session },
    );

    //Decrease stock for each item
    for (const item of items) {
      await decreaseStock(
        {
          productId: item.productId,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        },
        session
      );
    }

    //clear cart

    if (cart) {
      cart.items = [];
      await cart.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    let statusCode = 500;

    if (
      error.message === "Cart is empty" ||
      error.message.includes("stock") ||
      error.message.includes("Missing")
    ) {
      statusCode = 400;
    } else if (error.message === "User not found") {
      statusCode = 404;
    }
    res.status(statusCode).json({ error: error.message });
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
    const { userId } = req.params; // MongoDB _id

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const orders = await Order.find({ user: user._id }).populate(
      "user",
      "name email"
    );

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const orders = await Order.find({ user: user._id }).populate(
      "user",
      "name email"
    );

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
