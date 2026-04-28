
import API from "./api"
import {toast} from "sonner";


 export  const getAllCourses = async (params) => {
    try {
        const res = await API.get("/course/get-all-courses",{ params})
        toast.success(res.data.message)
        return { ok: true, data: res.data}

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch courses")
        return { ok: false }
    }
}

