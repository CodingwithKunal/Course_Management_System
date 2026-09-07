
import API from "./api"
import { toast } from "sonner";



// Get all courses with pagination and search
export const getAllCourses = async (params) => {
    try {
        const res = await API.get("/course/get-all-courses", { params })
        return { ok: true, data: res.data }

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch courses")
        return { ok: false }
    }
}



// Get course details by ID 
export const getCourseDetails = async (coureseId) => {
    try {
        const res = await API.get(`/course/course-details/${coureseId}`)
        return { ok: true, data: res.data }

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch course details")
        return { ok: false }
    }
}


export const enrollInCourse = async (courseId) => {
    try {
        const res = await API.post(`/course/enroll/${courseId}`) 
        if (res.data?.success) {
            toast.success(res.data.message || "Course enrolled successfully")
        }
        return { ok: true, data: res.data }
        
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to enroll in course")
        return { ok: false }
    }
}


// Check if user is enrolled in a course
export const checkCourseEnrollment = async (courseId) => {
    try {
        const res = await API.get(`/course/check-enrollment/${courseId}`)
        return { ok: true, isEnrolled: res.data.isEnrolled }
        
    } catch (error) {
        toast.error(error.response?.data?.message || "Error checking enrollment")
        return { ok: false, isEnrolled: false }
    }
}


export const getContinueLearningCourse = async () => {
    try {
        const res = await API.get("/course/continue-learning")
        return { data: res.data }
    } catch (error) {
        toast.error( error.response?.data?.message || "Failed to fetch continue learning course")
         
    }
}


export const courseRating = async (courseId,ratingData) =>{
    try {
        const res = await API.post(`/course/${courseId}/review`, ratingData)
        const message = "Thank you for your rating."
        toast.success(message)
        return { ok:true, data:res.data}
        
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to submit rating")
        return { ok: false, data: null }
    }
}
