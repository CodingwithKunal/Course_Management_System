import stripe from "../config/stripe.js";
import CourseModel from "../models/course.js";
import EnrollmentModel from "../models/enrollment.js";
import PaymentModel from "../models/payments.js";


// Create a payment intent for a course purchase
export const createPaymentIntent = async (req, res) => {
    try {
        // Extract courseId from the request body and userId from the authenticated user
        const { courseId } = req.body;
        const userId = req.user._id;
        // Fetch course details to get the price
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.price === 0) {
            return res.status(400).json({ message: "This course is free, no payment required" });
        }

        // Check if the user is already enrolled in the course
        const alreadyEnrolled = await EnrollmentModel.findOne({ user: userId, course: courseId });
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "You are already enrolled in this course" });
        }
        // Create a payment intent with the course price
        const payementIntent = await stripe.paymentIntents.create({
            amount: course.price * 100, // Stripe expects amount in cents
            currency: "inr",
            metadata: {
                userId: userId.toString(),
                courseId: courseId.toString(),
            },
        });
         // Save the payment details in the database with status "PENDING"
        await PaymentModel.create({
            user: userId,
            course: courseId,
            amount: course.price,
            stripePaymentIntentId: payementIntent.id,
            status: "PENDING",
        });

        // Return the client secret to the frontend to complete the payment
        res.status(200).json({ clientSecret: payementIntent.client_secret });




    } catch (error) {
        res.status(500).json({ message: "Failed to create payment intent", error: error.message });
    }
}


// Stripe webhook to handle payment status updates
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;

    const payment = await PaymentModel.findOne({
      stripePaymentIntentId: intent.id,
    });

    if (payment && payment.status !== "SUCCESS") {
      payment.status = "SUCCESS";
      payment.stripeChargeId = intent.latest_charge;
      await payment.save();

      await EnrollmentModel.create({
        user: payment.user,
        course: payment.course,
        paymentStatus: "SUCCESS",
      });
    }
  }

  res.json({ received: true });
};