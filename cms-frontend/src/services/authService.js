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

export const verifyOtpService = async (data) =>{
    try {
        const res = await API.post("/auth/verify-otp", data);
    return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "VerifyOtp Failed")
    }
}



export const forgotpassword = async(data) =>{
    try {
        const res = await API.post("/auth/forgot-password",data)
        toast.success(res.data.message || "Reset link sent to your email!")
        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message  || "Failed to send reset link!")

    }
}


export const reset_password = async({resetToken, newPassword}) =>{
    try {
        const res = await API.post(`/auth/reset-password/${resetToken}`, {newPassword})
        toast.message(res.data.message || "Password reset successfully!")
        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to reset password!")

    }
}