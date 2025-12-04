import Order from "../models/Order.js";

//Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      user,
      customerFirstName,
      customerLastName,
      email,
      phone,
      address,
      zipcode,
      items,
      totalPrice,
      /*status,
      paymentStatus,*/
    } = req.body;

    const newOrder = await Order.create({
      user,
      customerFirstName,
      customerLastName,
      email,
      phone,
      address,
      zipcode,
      items,
      totalPrice,
      /*status,
        paymentStatus,*/
    });

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

// Get orders by user ID
export const getOrdersByUser = async (req, res) => {
  try {
    const id = req.params.id;

    const orders = await Order.find({ user: id }).populate(
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
export const updateOrder = async (req, res) => {
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
