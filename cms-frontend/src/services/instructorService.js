
import { toast } from "sonner";
import API from "./api";



export const getInstructorApprovedStatus = async () => {
    try {
        const res = await API.get("/instructor/checkInstructorStatus")
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to check instructor status")
        return { ok: false }
    }
}



export const createCourse = async (courseData) => {
    try {
        const res = await API.post("/course/create-course", courseData)
        if (res.data?.success) {
            toast.success(res.data.message || "Course created successfully")
        }
        return { ok: true, data: res.data }

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create course")
        return { ok: false }
    }

}


export const updateCourse = async (courseId, courseData) => {
    try {
        const res = await API.put(`/course/update-course/${courseId}`, courseData)
        if (res.data?.success) {
            toast.success(res.data.message || "Course updated successfully")
        }
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to UpdateCourse")
        return { ok: false }
    }
}

export const resubmitCourse = async (courseId, courseData) =>{
    try {
        const res = await API.put(`/course/resubmit-course/${courseId}`, courseData)
        if (res.data?.success){
            toast.success(res.data.message || "Resubmited Successfully")
        }
        return {ok:true, data:res.data}

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to Resubmit")
        return {ok:false}
    }
}

export const deleteCourse = async (courseId) => {
    try {
        const res = await API.delete(`/course/delete-course/${courseId}`)
        if (res.data?.success) {
            toast.success("Course Deleted")
        }
        return { ok: true, data: res.data }

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete Course")
        return { ok: false }
    }
}


export const getInstructorCourses = async () => {
    try {
        const res = await API.get("/course/get-courses")
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to Get Instructor Courses")
        return { ok: false }


    }
}


export const submitCourseForReview = async (courseId) => {
    try {
        const res = await API.patch(`/course/submit/${courseId}`)
        if (res.data?.success) {
            toast.success(res.data.message || "Course submitted for review")
        }
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to submit course")
        return { ok: false }
    }
}



export const getEnrollmentsForInstructor = async () => {
    try {
        const res = await API.get("/instructor/totalEnrollments")
        return { ok: true, data: res.data }

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get total enrollments")
        return { ok: false }
    }
}

export const getRevenueForInstructor = async () => {
    try {
        const res = await API.get("/instructor/getInstructorRevenue")
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get total revenue")
        return { ok: false }
    }
}




export const getInstructorProfile = async () => {
    try {
        const res = await API.get("/instructor/viewInstructorProfile")
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get instructor profile")
        return { ok: false }
    }
}

export const updateInstructorProfile = async (profileData) => {
    try {
        const res = await API.put("/instructor/updateInstructorProfile", profileData)
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update instructor profile")
        return { ok: false }
    }
}



