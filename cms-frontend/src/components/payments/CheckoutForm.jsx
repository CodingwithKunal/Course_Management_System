import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { waitForEnrollment } from "../../services/paymentService.js";
import { useNavigate } from "react-router-dom";

function CheckoutForm({courseId}) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate(); 

    const [loading, setloading] = useState(false);

    const handleSubmit = async (e) => {
          e.preventDefault(); 
           setloading(true);
           
           const result = await stripe.confirmPayment({
            elements,
            redirect: "if_required", 
           })
           if (result.error) {
            setloading(false);
            return 
           }

           await waitForEnrollment(courseId) 

           navigate(`/`);
    };

  return (
    <main className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
            <PaymentElement className="mb-4" />
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </form>

    </main>
  )
}

export default CheckoutForm;
