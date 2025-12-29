import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const getCart = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = await Cart.findOne({ user: user._id });

    // const cart = await Cart.findOne({ user: user._id }).populate(
    //   "items.product"
    // );

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { productId, color, size, quantity } = req.body;

    if (!productId || !color || !size || !quantity)
      return res.status(400).json({ error: "Missing required fields" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const variant = product.variants.find(
      (v) => v.color.toLowerCase() === color.toLowerCase()
    );
    if (!variant) return res.status(400).json({ error: "Color not available" });

    const sizeObj = variant.sizes.find(
      (s) => s.size.toUpperCase() === size.toUpperCase()
    );
    if (!sizeObj || sizeObj.quantity < quantity)
      return res.status(400).json({ error: "Insufficient stock" });

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) cart = new Cart({ user: user._id, items: [] });

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (existingItem) existingItem.quantity += quantity;
    else
      cart.items.push({
        product: productId,
        color,
        size,
        quantity,
        price: product.price,
      });

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((item) => item.product.toString() === itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      item.remove();
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Cart.findOneAndUpdate({ user: user._id }, { items: [] });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
