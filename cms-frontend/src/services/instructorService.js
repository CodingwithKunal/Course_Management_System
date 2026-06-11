
import { toast } from "sonner";
import API from "./api";


export const createCourse = async (courseData) => {
      try {
        const res = await API.post("/course/create-course", courseData)
        toast.success(res.data.message)
        return {ok:true, data:res.data}
        
      } catch (error) {
         toast.error(error.response?.data?.message || "Failed to create course")
         return{ok:false}
      }
      
}


export const updateCourse = async (courseId) => {
    try {
        const res = await API.put(`/course/update-course/${courseId}`)
    toast.success(res.data.message)
    return {ok:true, data:res.data}
    } catch (error) {
         toast.error(error.response?.data?.message || "Failed to UpdateCourse")
         return {ok:false}
    }
}


export const getInstructorCourses = async () => {
    try {
         const res = await API.get("/course/get-courses")
         toast.success(res.data.message)
         return {ok:true, data:res.data}
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to Get Instructor Courses")

        
    }
}


export const  submitCourseForReview = async (courseId) => {
    try {
         const res = await API.patch(`/course/submit/${courseId}`)
         toast.success(res.data.message)
         return {ok:true, data:res.data}
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to submit course")
        return {ok:false}
    }
}