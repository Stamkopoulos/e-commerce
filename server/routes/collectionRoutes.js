import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/collections/:type", async (req, res) => {
  const { type } = req.params;

  try {
    let products;

    if (type === "men" || type === "women") {
      products = await Product.find({ gender: type });
    } else if (type === "accessories") {
      products = await Product.find({ category: "accessories" });
    } else {
      return res.status(400).json({ error: "Invalid collection type" });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
