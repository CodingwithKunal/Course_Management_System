import express from 'express';
const router = express.Router();
import { registerUser , registerInstructor , login,forgotPassword,resetPassword,logout, verifyOtp } from "../controller/auth.controller.js";

router.post('/register', registerUser);
router.post('/register-instructor', registerInstructor);
router.post("/verify-otp", verifyOtp)
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.post('/logout', logout);




export default router;