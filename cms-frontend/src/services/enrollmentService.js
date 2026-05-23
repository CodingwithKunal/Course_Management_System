import { toast } from 'sonner';
import API from './api.js';
import { data } from 'react-router';



export const updateWatchProgress = async (courseId, currentTime) => {
    try {
        const res = await API.patch(`/course/courses/${courseId}/watch-progress`, { currentTime })
        toast.success(res.data.message)
        return { ok: true, data: res.data }

    } catch (error) {
        toast.error(error.reponse?.data?.message || "Failed to update watch progress. Please try again.")
        return { ok: false }
    }

}




export const getCourseProgress = async (courseId) => {
    try {
        const res = await API.get(`/course/course/${courseId}/progress`)
        toast.success(res.data.message)
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch course progress. Please try again.")
        return { ok: false }
    }
}




export const markCourseComplete = async (courseId) => {
    try {
        const res = await API.patch(`/course/course/${courseId}/complete`)
        toast.success(res.data.message)
        return { ok: true, data: res.data }

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to mark course as complete. Please try again.")
        return { ok: false }
    }
}




export const getMyEnrollments = async () => {
    try {
        const res = await API.get("/course/my-enrollments")
        toast.success(res.data.message)
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch enrollments. Please try again.")
        return { ok: false }
    }
}