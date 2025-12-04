import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true }, //URL to product image
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
