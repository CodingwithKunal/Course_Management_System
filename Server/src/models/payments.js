import mongoose  from "mongoose";

const payementSchema = new mongoose.Schema({

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

 

  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "inr"
  },
   paidAt: {
    type: Date
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  stripeChargeId: {
    type: String
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },
  paymentMethod: {
    type: String,
    default: "CARD"
  },
  metadata: {
    type: Object
  },
   failureReason: {
    type: String
  }


}, { timestamps: true });

payementSchema.index({ user: 1 });
payementSchema.index({ course: 1 });
payementSchema.index({ status: 1 });

const PaymentModel = mongoose.model("Payment", payementSchema);
export default PaymentModel;