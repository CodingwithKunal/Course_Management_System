
import express from "express";
const app = express();

import mongoose from "mongoose";
mongoose.set("strictQuery", true); 

import {connectDB} from "./src/config/mongodb.js";
connectDB();

import authRouter from "./src/routes/auth.router.js";
import adminRouter from "./src/routes/admin.routes.js";
import instructorRouter from "./src/routes/instructor.routes.js";
import courseRouter from "./src/routes/course.routes.js";
import paymenRouter from "./src/routes/payment.routes.js";


import cors from 'cors';
import { stripeWebhook } from "./src/controller/payment.controller.js";



app.use(cors({
    origin: process.env.Frontend_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT","PATCH","DELETE"],
    credentials: true,
}))

   

app.use(
  "/api/payments/stripe-webhook",
  express.raw({ type: "application/json" }), 
     stripeWebhook
);



app.use(express.json())
app.use(express.urlencoded({ extended: true }));





app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/course", courseRouter);

app.use("/api/payments", paymenRouter); 





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})



