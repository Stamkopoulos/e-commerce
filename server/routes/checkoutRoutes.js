import express from "express";
import { stripe } from "../stripe.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "GR", "DE", "FR", "IT", "ES"],
      },
      phone_number_collection: {
        enabled: true,
      },
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            images: [item.image],
            metadata: {
              productId: item._id || item.id,
              color: item.color || "",
              size: item.size || "",
            },
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity),
      })),
      success_url: `${process.env.FRONTEND_URL}/receipt?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });

    console.log("Stripe session created:", session.url);

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/create-order-from-session", async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    const fullName = session.customer_details?.name || "";
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "Guest";
    const lastName = nameParts.slice(1).join(" ") || "Customer";

    const shippingAddress = session.shipping_details?.address || {};
    const address =
      [shippingAddress.line1, shippingAddress.line2]
        .filter(Boolean)
        .join(", ") || "Not provided";

    const order = await Order.create({
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      customerFirstName: firstName,
      customerLastName: lastName,
      email: session.customer_details?.email || "no-email@provided.com",
      phone: session.customer_details?.phone || "Not provided",
      address: address,
      zipCode: shippingAddress.postal_code || "Not provided",
      items: session.line_items.data.map((item) => ({
        productId: item.price?.product?.metadata?.productId || null,
        name: item.description,
        price: item.amount_total / 100,
        quantity: item.quantity,
        color: item.price?.product?.metadata?.color,
        size: item.price?.product?.metadata?.size,
      })),
      totalPrice: session.amount_total / 100,
      status: "pending",
      paymentStatus: session.payment_status === "paid" ? "paid" : "unpaid",
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id, {
      expand: ["line_items"],
    });
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
