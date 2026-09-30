import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    thumbnail: {
      type: String, 
    },

    category: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER",
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"],
      default: "DRAFT",
    },

    rejectionReason: {
      type: String,
    },

    averageRating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    }
  },

  { timestamps: true }
);

courseSchema.index({status:1, category:1, level:1, studentsEnrolled:1})
const CourseModel = mongoose.model("Course", courseSchema);
export default CourseModel;