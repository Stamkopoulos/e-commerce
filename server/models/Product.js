import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    gender: { type: String, enum: ["men", "women"], required: true},
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
