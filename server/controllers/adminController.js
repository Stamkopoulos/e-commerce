import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

//Dashboard overview
export const getDashboardOverview = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find({}); //.sort({createdAt:-1}).limit(5);
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);

    //Sales last 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const salesOverview = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top products by total quantity sold
    let topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          image: { $first: "$items.image" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Fetch the product documents to get the image
    const productIds = topProducts.map((p) => p._id);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    // Map images from products
    topProducts = topProducts.map((p) => {
      const prod = products.find(
        (pr) => pr._id.toString() === p._id.toString(),
      );

      // Pick the first image of the first variant that has images
      let image = "/images/placeholder.png"; // fallback
      if (prod?.variants?.length) {
        const firstVariantWithImages = prod.variants.find(
          (v) => v.images && v.images.length > 0,
        );
        if (firstVariantWithImages) {
          image = firstVariantWithImages.images[0];
        }
      }

      return {
        productId: p._id,
        name: p.name,
        totalSold: p.totalSold,
        revenue: p.revenue,
        image,
      };
    });

    console.log("Top Products Aggregation Result:", topProducts);

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders,
      salesOverview,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Product section
export const getAdminProducts = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const outOfStock = await Product.countDocuments({ quantity: 0 });
    const lowStock = await Product.countDocuments({ quantity: { $lte: 5 } });
    const inStock = totalProducts - outOfStock;

    res.json({
      totalProducts,
      outOfStock,
      lowStock,
      inStock,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const shippedOrders = await Order.countDocuments({ status: "shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    res.json({
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const customers = await User.countDocuments({ role: "user" });
    const admins = await User.countDocuments({ role: "admin" });
    const blockedUsers = await User.countDocuments({ status: "blocked" });

    res.json({
      totalUsers,
      customers,
      admins,
      blockedUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const createDiscount = async (req, res) => {};

// export const updateDiscount = async (req, res) => {};

// export const deleteDiscount = async (req, res) => {};

// export const getSettings = async (req, res) => {};

// export const updateSettings = async (req, res) => {};
