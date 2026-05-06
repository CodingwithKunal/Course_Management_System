import API from "./api"
import { toast } from "sonner";


export const createPaymentIntent = async (courseId) => {
    try {
        const res = await API.post("/payments/create-intent", {courseId})
        toast.success("Payment intent created, proceed to payment")
        return { ok: true, clientSecret: res.data.clientSecret}
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create payment intent")
        return { ok: false}
    }
}




export const waitForEnrollment = async (courseId) =>{
    try {

        for (let i = 0; i<15; i++){
            const res = await API.get("/course/my-enrollments") 
            const isEnrolled = res.data.enrollments.find(enrollments => enrollments.course._id === courseId)
            if (isEnrolled) {
                toast.success("Enrollment confirmed, you can access the course now")
                return { ok: true}
            } else {
                await new Promise(resolve => setTimeout(resolve, 1500))
            }
        }
        toast.error("Enrollment delayed. Please refresh.")
        return { ok: false} 
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to check enrollment status")
        return { ok: false}
    }
}


