import mongoose from "mongoose";

const userchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, },
    role: { type: String, enum: ["ADMIN", "INSTRUCTOR", "USER"], default: "USER" },
    isBlocked: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    instructor: {
        bio: { type: String , default: "Not bio" },
        expertise: { type: String , default: "Not specified" },
        experience: { type: String , default: "Not specified" },
        isApproved: { type: Boolean, default: false },
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