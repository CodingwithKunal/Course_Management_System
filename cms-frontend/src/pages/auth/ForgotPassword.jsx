import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
 
import { forgotpassword } from "../../services/authService";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";


export const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    // TanStack Query Mutation
    const { mutate, isPending, isSuccess, error } = useMutation({
        mutationFn: forgotpassword,
       
       
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;

        // Trigger Mutation
        mutate({ email });
    };
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-white">
            <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">

                <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <FiArrowLeft className="mr-2" /> Back to Login
                </Link>

                {!isSuccess ? (
                    <>
                        <div className="mb-6 text-center py-5">
                            <h2 className="text-2xl font-bold tracking-tight">Forgot Password?</h2>
                            <p className="text-sm text-gray-400 mt-2">
                                Enter your registered email address and we'll send you a password reset link.
                            </p>
                        </div>

                        {/* Error Message from Mutation */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                {error.response?.data?.message || "Something went wrong!"}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-sky-600/20 cursor-pointer"
                            >
                                {isPending ? "Sending Link..." : "Send Reset Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    /* Success Screen View */
                    <div className="text-center py-4 space-y-4">
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                            <FiCheckCircle />
                        </div>
                        <h3 className="text-xl font-bold">Check your email</h3>
                        <p className="text-sm text-gray-400">
                            We have sent a password reset link to <span className="text-white font-medium">{email}</span>.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
