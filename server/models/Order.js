import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow guest checkout
    },

    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true, // Allows null but enforces uniqueness when present
    },
    stripePaymentIntentId: {
      type: String,
    },

    // Customer details
    customerFirstName: { type: String, required: true },
    customerLastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },

    // Products in the order
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: false,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        color: { type: String, required: false },
        size: { type: String, required: false },
      },
    ],

    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
