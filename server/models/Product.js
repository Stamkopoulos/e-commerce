import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },

    gender: {
      type: String,
      enum: ["men", "women", "unisex", "kids"],
      default: "unisex",
    },

    // Colors + images + sizes + stock
    variants: [
      {
        color: { type: String, required: true },
        images: [String],

        sizes: [
          {
            size: { type: String, required: true }, // XS, S, 36, 37, etc.
            quantity: { type: Number, required: true, default: 0 },
          },
        ],
      },
    ],
    bestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
