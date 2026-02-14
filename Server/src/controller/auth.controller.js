
import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";





export const registerUser = async (req, res) => {
     const { name, email, password } = req.body;
    try {

        // check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // create new user and hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const User = await UserModel.create({ 
            name, 
            email, 
            password: passwordHash,
            role:"USER"
        });

        // create JWT token
        const token = jwt.sign({ userId: User._id, role: User.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
       
        res.status(201).json({ message: "User registered successfully", user: User , token });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}



export const registerInstructor = async (req, res) => {
    const { name, email, password, bio, expertise, experience } = req.body;
    try {
        // check if user already exists
        const existingUser = await UserModel.findOne({ email});
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        // create new user and hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const User = await UserModel.create({
            name,
            email,
            password: passwordHash,
            role: "INSTRUCTOR",
            instructor: {
                bio,
                expertise,
                experience,
                isApproved: false,
            }
        })

        // create JWT token
        const token = jwt.sign({ userId: User._id, role: User.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ message: "Instructor registered successfully", user: User, token });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account is blocked. Please contact support." });
        }

        // check if instructor is approved
        if (user.role === "INSTRUCTOR" && !user.instructor.isApproved) {
            return res.status(403).json({ message: "Your instructor account is pending approval. Please wait for admin approval." });
        }

        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // create JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Login successful", user, token });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email});
        if (!user) {
            return res.status(400).json({ message: "this email does not exist" });
        }

        // generate reset token 
        const resetToken = crypto.randomBytes(20).toString("hex");

        // store resest token in db as hash 
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // token expires in 10 minutes
        await user.save();

        res.status(200).json({ message: "Reset password link sent", 
            // resetToken  // remove in production, only for testing
        });
        
    } catch (error) {
       res.status(500).json({ message: "Server error", error: error.message }); 
    }
}

export const resetPassword = async (req, res) => {
        const {resetToken} = req.params; // get reset token from url params
        const { newPassword } = req.body;
        try {

        // hash the reset token to compare with db
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        // find user with matching reset token and check if token is not expired
        const user = await UserModel.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: { $gt: Date.now() }, // check if token is not expired , "greater than" current time
        })
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // hash the new password and save to db
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        user.password = newPasswordHash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });




        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
}

export const logout = async (req, res) => {
       res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // set cookie to expire immediately
        sameSite: "Strict", 
       })
         res.status(200).json({ message: "Logout successful" });
}


