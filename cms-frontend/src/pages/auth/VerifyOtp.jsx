import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyOtpService } from "../../services/authService";


export const VerifyOtp = () => {

    const location = useLocation();
    const navigate = useNavigate();

    // Email passed from registration state
    const email = location.state?.email || "";
    const [otp, setOtp] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: verifyOtpService,
        onSuccess: (data) => {
            toast.success(data.message || "Email verified successfully!");
            navigate("/login");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Invalid OTP!");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        mutate({ email, otp });
    };


    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-white">
            <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl text-center">
                <div className="w-14 h-14 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
                    Icon
                </div>

                <h2 className="text-2xl font-bold">Verify Your Email</h2>
                <p className="text-sm text-gray-400 mt-2">
                    We sent a 6-digit verification OTP to <br />
                    <span className="text-white font-medium">{email || "your registered email"}</span>
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.trim())}
                            placeholder="Enter 6-digit OTP"
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 text-center text-2xl tracking-widest font-mono text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        {isPending ? "Verifying..." : "Verify & Continue"}
                    </button>
                </form>
            </div>
        </div>
    )
}
