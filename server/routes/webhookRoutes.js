import express from "express";
import { Router } from "express";
import { handleClerkWebhook } from "../controllers/webhookController.js";

const router = Router();

router.post(
  "/clerk/users",
  express.raw({ type: "application/json" }),
  handleClerkWebhook
);
export default router;
