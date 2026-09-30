import stripe from "../config/stripe.js";
import CourseModel from "../models/course.js";
import EnrollmentModel from "../models/enrollment.js";
import PaymentModel from "../models/payments.js";



export const createPaymentIntent = async (req, res) => {
  try {
    
    const { courseId } = req.body;
    const userId = req.user._id;
    
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.price === 0) {
      return res.status(400).json({ message: "Free Course" });
    }

    
    const alreadyEnrolled = await EnrollmentModel.findOne({ user: userId, course: courseId });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100, 
      currency: "inr",
      metadata: {
        userId: userId.toString(),
        courseId: courseId.toString(),
      },
    });
    
    await PaymentModel.create({
      user: userId,
      course: courseId,
      amount: course.price,
      currency: "inr",
      stripePaymentIntentId: paymentIntent.id,
      status: "PENDING",
    });

    
    res.status(200).json({ clientSecret: paymentIntent.client_secret });




  } catch (error) {
    res.status(500).json({ message: "Failed to create payment intent", error: error.message });
  }
}



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

  const intent = event.data.object;
  const payment = await PaymentModel.findOne({
    stripePaymentIntentId: intent.id,
  });

  if (!payment) return res.json({ received: true });

  
  if (event.type === "payment_intent.succeeded") {
    if (payment.status !== "SUCCESS") {
      payment.status = "SUCCESS";
      payment.paidAt = new Date();
      await payment.save();
    }

    const existingEnrollment = await EnrollmentModel.findOne({
      user: payment.user,
      course: payment.course
    });

    if (!existingEnrollment) {
      await EnrollmentModel.create({
        user: payment.user,
        course: payment.course,
        paymentStatus: "SUCCESS",
      });
    }

    
    console.log("Adding paid-course student to studentsEnrolled:", {
      courseId: payment.course.toString(),
      userId: payment.user.toString(),
    });
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      payment.course,
      { $addToSet: { studentsEnrolled: payment.user } },
      { new: true }
    );
    console.log("Course after adding paid-course student:", updatedCourse);

  }

  
  if (event.type === "payment_intent.payment_failed") {
    payment.status = "FAILED";
    payment.failureReason = intent.last_payment_error ? intent.last_payment_error.message : "Unknown error";
    await payment.save();
  }

  res.json({ received: true });
};









