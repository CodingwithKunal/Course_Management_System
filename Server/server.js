import { config } from "dotenv";
config();

import express from "express";
const app = express();

import mongoose from "mongoose";
mongoose.set("strictQuery", true);

import {connectDB} from "./src/config/mongodb.js";
connectDB();

import authRouter from "./src/routes/auth.router.js";


import cors from 'cors';
app.use(cors({
    origin: "",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))
   


app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use("/api/auth", authRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})



