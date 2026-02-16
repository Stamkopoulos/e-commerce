import express from "express";
import { Router } from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import { handleClerkWebhook } from "../controllers/webhookController.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Clerk webhook endpoint
router.post(
  "/clerk/users",
  express.raw({ type: "application/json" }),
  handleClerkWebhook,
);

// Stripe webhook endpoint
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`✅ Webhook received: ${event.type}`); // DEBUG: Log event type

    try {
      // Handle different webhook event types
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          console.log(`🛒 Processing checkout session: ${session.id}`); // DEBUG
          await handleCheckoutCompleted(session);
          break;

        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          console.log(`💰 Processing payment intent: ${paymentIntent.id}`); // DEBUG
          await handlePaymentSucceeded(paymentIntent);
          break;

        default:
          console.log(`⚠️ Unhandled event type: ${event.type}`); // DEBUG
      }

      res.json({ received: true });
    } catch (err) {
      console.error("❌ Error processing webhook:", err); // DEBUG: Log errors
      res.status(500).send("Webhook processing failed");
    }
  },
);

async function handleCheckoutCompleted(session) {
  console.log("🛒 Checkout completed:", session.id); // DEBUG

  // Retrieve full session details with line items
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price.product", "customer"],
  });

  console.log("📦 Full session retrieved"); // DEBUG
  console.log("👤 Customer details:", fullSession.customer_details); // DEBUG
  console.log("📍 Shipping details:", fullSession.shipping_details); // DEBUG
  console.log("🛍️ Line items count:", fullSession.line_items.data.length); // DEBUG

  // Extract customer name
  const fullName = fullSession.customer_details?.name || "";
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] || "Guest";
  const lastName = nameParts.slice(1).join(" ") || "Customer";

  console.log(`👤 Extracted name: ${firstName} ${lastName}`); // DEBUG

  // Extract shipping address
  const shippingAddress = fullSession.shipping_details?.address || {};
  const address =
    [shippingAddress.line1, shippingAddress.line2].filter(Boolean).join(", ") ||
    "Not provided";

  console.log(`📍 Address: ${address}`); // DEBUG
  console.log(`📮 Zip: ${shippingAddress.postal_code}`); // DEBUG

  // Create order object
  const orderData = {
    stripeSessionId: fullSession.id,
    stripePaymentIntentId: fullSession.payment_intent,
    customerFirstName: firstName,
    customerLastName: lastName,
    email: fullSession.customer_details?.email || "no-email@provided.com",
    phone:
      fullSession.customer_details?.phone ||
      fullSession.shipping_details?.phone ||
      "Not provided",
    address: address,
    zipCode: shippingAddress.postal_code || "Not provided",

    items: fullSession.line_items.data.map((item) => ({
      productId: null,
      name: item.description,
      price: item.amount_total / 100,
      quantity: item.quantity,
      color: item.price?.metadata?.color || undefined,
      size: item.price?.metadata?.size || undefined,
    })),

    totalPrice: fullSession.amount_total / 100,
    status: "pending",
    paymentStatus: "unpaid",
  };

  console.log("💾 Attempting to save order..."); // DEBUG
  console.log("Order data:", JSON.stringify(orderData, null, 2)); // DEBUG: Full order data

  try {
    // Save to MongoDB
    const order = new Order(orderData);
    await order.save();

    console.log("✅ Order saved successfully! Order ID:", order._id); // DEBUG
  } catch (saveError) {
    console.error("❌ Failed to save order:", saveError); // DEBUG: Save error
    throw saveError;
  }
}

async function handlePaymentSucceeded(paymentIntent) {
  console.log("💰 Payment succeeded:", paymentIntent.id); // DEBUG

  const result = await Order.updateOne(
    { stripePaymentIntentId: paymentIntent.id },
    { paymentStatus: "paid" },
  );

  console.log(
    "✅ Order payment status updated. Modified count:",
    result.modifiedCount,
  ); // DEBUG

  if (result.modifiedCount === 0) {
    console.log("⚠️ No order found with payment intent:", paymentIntent.id); // DEBUG
  }
}

export default router;
