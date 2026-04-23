import API from "./api";
import { toast } from "sonner";

export const loginUser = async (data) => {
    try {
        const res = await API.post("/auth/login", data, { withCredentials: true });
        toast.success(res.data.message);
        return { ok: true, data: res.data }

    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
        return { ok: false }
    }
}

export const registerUser = async (data) => {
    try {
        const res = await API.post("/auth/register", data);
        toast.success(res.data.message);
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed");
        return { ok: false }
    }
}


export const registerInstructor = async (data) => {
    try {
        const res = await API.post("/auth/register-instructor", data);
        toast.success(res.data.message);
        return { ok: true, data: res.data }
    } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed");
        return { ok: false }
    }
}