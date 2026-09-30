import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema({
    bio: { type: String, default: "No bio" },
    expertise: { type: String, default: "Not specified" },
    experience: { type: String, default: "Not specified" },
    isApproved: { type: Boolean, default: false },
}, { _id: false });

const userchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["ADMIN", "INSTRUCTOR", "USER"], default: "USER" },
    isBlocked: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    instructor: { type: instructorSchema, default: undefined },

    isVerified: {
        type: Boolean,
        default: false,
    },
    
    otp: {
        type: String,
    },
    otpExpire: {
        type: Date,
    },

    resetPasswordToken: {
        type: String,
    },

    resetPasswordExpire: {
        type: Date,
    },



}, { timestamps: true },)

const UserModel = mongoose.model("User", userchema);
export default UserModel;