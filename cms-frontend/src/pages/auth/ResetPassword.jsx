
import { toast } from "sonner";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { reset_password } from '../../services/authService';
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { FiCheckCircle, FiLock } from "react-icons/fi";

export const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // TanStack Query Mutation
    const { mutate, isPending, isSuccess, error } = useMutation({
        mutationFn:  reset_password,
        onSuccess: (data) => {
            toast.success(data.message || "Password reset successful!");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to reset password!");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        // Trigger Reset Mutation
        mutate({ resetToken, newPassword });
    };
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-white">
            <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
                {!isSuccess ? (
                    <>
                        <div className="mb-6 text-center">
                            <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto text-2xl mb-3">
                                <FiLock />
                            </div>
                            <h2 className="text-2xl font-bold">Set New Password</h2>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                {error.response?.data?.message || "Invalid or expired reset link."}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 px-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <LuEyeClosed /> : <LuEye />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full mt-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                            >
                                {isPending ? "Resetting Password..." : "Reset Password"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4 space-y-4">
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                            <FiCheckCircle />
                        </div>
                        <h3 className="text-2xl font-bold">Password Reset Successful!</h3>
                        <p className="text-sm text-gray-400">Redirecting to login page...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
