import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const productIds = topProducts.map((p) => p._id);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    topProducts = topProducts.map((p) => {
      const prod = products.find(
        (pr) => pr._id.toString() === p._id.toString(),
      );

      let image = "/images/placeholder.png";
      let price = 0;

      if (prod) {
        // Get product price: either main price or first variant
        price = prod.price || prod.variants?.[0]?.price || 0;

        const firstVariantWithImages = prod.variants?.find(
          (v) => v.images && v.images.length > 0,
        );
        if (firstVariantWithImages) image = firstVariantWithImages.images[0];
      }

      return {
        productId: p._id,
        name: p.name,
        totalSold: p.totalSold,
        revenue: p.revenue,
        image,
        price, // <-- add price here
      };
    });

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
