import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true

    },

} , { timestamps: true });

reviewSchema.index({ user: 1, course: 1 }, { unique: true }); // Ensure a user can review a course only once

const ReviewModel = mongoose.model("Review", reviewSchema);
export default ReviewModel;