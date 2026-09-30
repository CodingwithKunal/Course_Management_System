import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  course: {
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
    type: String,
    enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
    default: "NOT_STARTED",
  },

  lastWatchedTime: {
    type: Number,
    default: 0
  },

  lastWatchedAt : {
    type: Date,
    default: Date.now
  }



}, { timestamps: true });

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });  
const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);
export default EnrollmentModel;
