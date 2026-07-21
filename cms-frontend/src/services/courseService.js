
import API from "./api"
import { toast } from "sonner";



// Get all courses with pagination and search
export const getAllCourses = async (params) => {
    try {
        const res = await API.get("/course/get-all-courses", { params })
        toast.success(res.data.message)
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
        toast.success(res.data.message)
        return { ok: true, data: res.data }

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch course details")
        return { ok: false }
    }
}


export const enrollInCourse = async (courseId) => {
    try {
        const res = await API.post(`/course/enroll/${courseId}`) 
        toast.success(res.data.message)
        return {ok: true, data: res.data}
        
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to enroll in course")
        return { ok: false}
    }
}


// Check if user is enrolled in a course
export const checkCourseEnrollment = async (courseId) => {
    try {
        const res = await API.get(`/course/check-enrollment/${courseId}`)
        return { ok: true, isEnrolled: res.data.isEnrolled }
        
    } catch (error) {
        toast.error("Error checking enrollment:", error.response?.data?.message || error.message)
        return { ok: false, isEnrolled: false }
    }
}


export const getContinueLearningCourse = async () => {
    try {
        const res = await API.get("/course/continue-learning")
        return { ok: true, data: res.data }
    } catch (error) {
        
        toast.error( error.response?.data?.message || "Failed to fetch continue learning course")
        return { ok: false }
    }
}

