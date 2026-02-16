import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
dotenv.config();

import productRoutes from "./routes/productRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bestSeller from "./routes/bestSellerRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import connectDB from "./config/db.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware (MUST come FIRST)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api/webhook", webhookRoutes);
app.use(express.json()); // This MUST come before routes

//Public Routes (after express.json() but before clerkMiddleware)
app.use("/api/newsletter", newsletterRoutes);

//Clerk Middleware (applies to routes below)
app.use(clerkMiddleware());

//Routes
app.use("/api/collections", collectionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/best-sellers", bestSeller);
app.use("/api/admin", adminRoutes);
app.use("/api/checkout", checkoutRoutes);

//Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
