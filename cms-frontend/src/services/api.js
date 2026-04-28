import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
    baseURL: import.meta.env.VIT_Backend_URL || "http://localhost:5000/api",
})
// Attach token automatically
   API.interceptors.request.use((req)=> {
    const token = localStorage.getItem("token");
    if(token) {
        req.headers.Authorization = `Bearer ${token}`;  
    }

    return req;
})

// Response interceptor to handle errors globally 
  API.interceptors.response.use((res) => res, (err) => {
    const status = err.response ? err.response.status : null;
    if(status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
    }
    if(status === 403) {
        toast.error("You don't have access to this")
    }
        return Promise.reject(err);
  });
export default API;
