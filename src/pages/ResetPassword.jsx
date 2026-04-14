import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, KeyRound, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,20}$/;
        return regex.test(password);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!email) {
            setError("Email is required");
            return;
        }

        setLoading(true);
        setError("")
        setSuccess("");

        try {
            const API = import.meta.env.VITE_API_URL;

            await axios.post(`${API}/api/users/forgot-password`, { email });

            setSuccess("OTP sent to your email");
            setStep(2);
        } catch (e) {
            setError(
                e.response?.data?.message || e.message || "Failed to send OTP"
            );
        } finally {
            setLoading(false);
        }
    };


    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (!validatePassword(newPassword)) {
            setError("Password must be 6-20 chars and inlcude uppercase, lowercase, number, and special character");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Password do not match");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const API = import.meta.env.VITE_API_URL;

            await axios.post(`${API}/api/users/reset-password`, {
                email,
                otp,
                newPassword,
                confirmPassword
            });

            setSuccess("Password reset successful");

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.message || err.message || "Failed to reset password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-slate-950 font-sans overflow-hidden px-4 py-12">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <img
                    src="/images/bg-view.png"
                    alt="DevPulse Background"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950/80 to-black z-0" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Back to login button */}
                <Link to="/login" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-emerald-400 mb-6 transition-colors group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Login
                </Link>

                <div className="bg-black/85 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="mb-8 text-center">
                        {/* <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                            <Lock className="text-emerald-400" size={32} />
                        </div> */}
                        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                            {step === 1 ? "Forgot Password?" : "Set New Password"}
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {step === 1 ? "Enter your email address to receive a secure OTP for resetting your password." : "Secure your account with a strong new password."}
                        </p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold flex items-center shadow-lg">
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-semibold flex items-center shadow-lg">
                            <CheckCircle2 size={18} className="mr-2 shrink-0" />
                            {success}
                        </motion.div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="hello@example.com"
                                        disabled={loading}
                                        className="w-full pl-12 pr-5 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-sans"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-2xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border-2 border-black/80 border-t-transparent animate-spin" />
                                        Sending...
                                    </span>
                                ) : "Send OTP"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                    OTP Code
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        disabled={loading}
                                        className="w-full px-5 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono tracking-widest text-center text-lg shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyRound size={18} className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono tracking-widest"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-emerald-400 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyRound size={18} className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono tracking-widest"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-emerald-400 transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed px-1">
                                Password must be 6-20 characters, include uppercase, lowercase, number, and special character.
                            </p>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-2xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border-2 border-black/80 border-t-transparent animate-spin" />
                                        Resetting...
                                    </span>
                                ) : "Reset Password"}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;