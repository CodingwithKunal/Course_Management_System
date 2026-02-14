import express from 'express';
const router = express.Router();
import { registerUser , registerInstructor , login,forgotPassword,resetPassword,logout } from "../controller/auth.controller.js";

router.post('/register', registerUser);
router.post('/register-instructor', registerInstructor);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.post('/logout', logout);




export default router;