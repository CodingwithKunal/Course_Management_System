import express from "express";
const router = express.Router();
import {verifyToken} from "../middleware/auth.middleware.js";
import { createPaymentIntent , stripeWebhook } from "../controller/payment.controller.js";



router.post("/create-intent", verifyToken, createPaymentIntent);
router.post("/webhook", stripeWebhook);

export default router;