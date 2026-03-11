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
  stripePaymentIntentId: {
    type: String,
    required: true
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
  }
}, { timestamps: true });

const PaymentModel = mongoose.model("Payment", payementSchema);
export default PaymentModel;