import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 
    
    course : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },  
    
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    progress: {
      type: Number,
      default: 0, // percentage
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  
}, { timestamps: true });

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true }); // Ensure a user can enroll in a course only once

const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);
export default EnrollmentModel;
