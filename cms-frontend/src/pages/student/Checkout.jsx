import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createPaymentIntent } from "../../services/paymentService.js";
import StripeWrapper from "../../components/payments/StripeWrapper";
import CheckoutForm from "../../components/payments/CheckoutForm";

function Checkout() {
    const { courseId } = useParams();
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const init = async () => {
            const res = await createPaymentIntent(courseId);
            if (res.ok) { 
                setClientSecret(res.clientSecret)
            }
        
        }
        init();
    }, [courseId])

    if (!clientSecret) {
        return <div className="min-h-screen flex items-center justify-center">Loading payment...</div>
    }

  return (
    <StripeWrapper clientSecret={clientSecret}>
        <CheckoutForm courseId={courseId}/>
    </StripeWrapper>
  )
}

export default Checkout
