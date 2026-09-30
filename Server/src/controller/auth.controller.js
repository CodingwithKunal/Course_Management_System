
import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";





export const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    try {

        if (!name || !email || !password) {
            return res.status(400).json({ massage: "All fields are required" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords doesn't match" });
        }

        
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        
        const passwordHash = await bcrypt.hash(password, 10);

        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex")


        const User = await UserModel.create({
            name,
            email,
            password: passwordHash,
            role: "USER",
            isVerified: false,
            otp: otpHash,
            otpExpire: Date.now() + 10 * 60 * 1000, 
        });

        
        const emailMessage = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Email Verification OTP</h2>
                <p>Welcome to Learnify! Your OTP for email verification is:</p>
                <h1 style="color: #0284c7; letter-spacing: 2px;">${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
            </div>
        `;

        await sendEmail({
            email: User.email,
            subject: "Verify Your Email - Learnify",
            htmlMessage: emailMessage,
        })

        
        const token = jwt.sign({ userId: User._id, role: User.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        const userObj = User.toObject()
        delete userObj.password
        delete userObj.instructor

        res.status(201).json({ message: "Registration successful! Please check your email for OTP verification.", user: userObj, token, email: User.email });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}



export const registerInstructor = async (req, res) => {
    const { name, email, password, confirmPassword, bio, expertise, experience } = req.body;
    try {

        if (!name || !email || !password || !bio || !expertise) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords doesn't match" });
        }
        
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        
        const passwordHash = await bcrypt.hash(password, 10);

        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        const User = await UserModel.create({
            name,
            email,
            password: passwordHash,
            role: "INSTRUCTOR",
            isVerified: false,
            otp: otpHash,
            otpExpire: Date.now() + 10 * 60 * 1000, 
            instructor: {
                bio,
                expertise,
                experience,
                isApproved: false,
            }
        })

        const emailMessage = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Instructor Email Verification</h2>
        <p>Welcome aboard! Use the OTP below to complete your instructor registration:</p>
        <h1 style="color: #0284c7; letter-spacing: 2px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `;

        await sendEmail({
            email: User.email,
            subject: "Verify Your Instructor Account - Learnify",
            htmlMessage: emailMessage,
        });

        
        const token = jwt.sign({ userId: User._id, role: User.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        const userObj = User.toObject()
        delete userObj.password


        res.status(201).json({ message: "Instructor registered! Check email for OTP verification.", user: userObj, token, email:User.email });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}



export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }
        
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        if (user.otp !== otpHash || user.otpExpire < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully! You can now log in." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}





export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email OTP before logging in." });
        }

        
        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account is blocked. Please contact to support." });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }


        
        if (user.role === "INSTRUCTOR" && !user.instructor.isApproved) {
            return res.status(403).json({ message: "Your instructor account is pending for Approval. Please wait upto 2 days for admin approval ." });
        }


        
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        const userObj = user.toObject()
        delete userObj.password

        res.status(200).json({ message: "Login successful", user: userObj, token });

    } catch (error) {

        res.status(500).json({ message: "Server error", error: error.message });
    }
}



export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "This email does not exist" });
        }

        
        const resetToken = crypto.randomBytes(20).toString("hex");

        
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
        await user.save();
        
        const resetUrl = `${process.env.Frontend_URL}/reset-password/${resetToken}`

        

        const message = `
        <div style="font-family: Arial, sans-serif; padding: 20px; ">
                <h2>Password Reset Request</h2>
                <p>You have requested to reset your account password. Click the button below:</p>
                <a href="${resetUrl}" style="background-color: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                <p style="margin-top: 15px; color: #666; font-size: 12px;">This link will expire in 10 minutes. If you didn't request it, ignore it.</p>
            </div>
        `

        
        await sendEmail({
            email: user.email,
            subject: "Learnify - Password Reset Request",
            htmlMessage: message,
        })

        res.status(200).json({ message: "Password reset link sent to your email check it now." });


    } catch (error) {
        
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
        }
        res.status(500).json({ message: "Email could not be sent", error: error.message });
    }
}



export const resetPassword = async (req, res) => {
    const { resetToken } = req.params; 
    const { newPassword } = req.body;
    try {

        
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        
        const user = await UserModel.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: { $gt: Date.now() }, 
        })
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        user.password = newPasswordHash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true });




    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}



export const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), 
        sameSite: "Strict",
    })
    res.status(200).json({ message: "Logout successful" });
}


