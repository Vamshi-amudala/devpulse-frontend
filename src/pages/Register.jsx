import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,20}$/;
        return regex.test(password);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const registerHandler = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }
        if (!validatePassword(formData.password)) {
            setError("Password must be 6-20 characters and include uppercase, lowercase, number, and special character");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const API = import.meta.env.VITE_API_URL;
            await axios.post(`${API}/api/users/register`, formData);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        /* ── Full-screen root ── */
        <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">

            {/* ── Background image — always covers entire screen ── */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <img
                    src="/images/bg-view.png"
                    alt="DevPulse Background"
                    className="w-full h-full object-cover mix-blend-screen opacity-40"
                />
                {/* gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* ── Two-panel layout — stacks on mobile, side-by-side on md+ ── */}
            <div className="relative z-10 flex flex-col md:flex-row min-h-screen">

                {/* ── LEFT panel — marketing copy ── */}
                {/* Hidden on mobile, shown from md breakpoint */}
                <div className="hidden md:flex flex-col justify-center flex-1 px-10 lg:px-16 xl:px-24 pt-24 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="max-w-lg"
                    >
                        <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400/30 bg-emerald-950/40 px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                            Join the Community
                        </span>

                        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
                            Architect <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                                better systems.
                            </span>
                        </h2>

                        <p className="text-slate-300 text-base lg:text-lg leading-relaxed drop-shadow-md">
                            Connect with engineers worldwide, share innovative ideas, and master backend scalability.
                        </p>

                        {/* Decorative stats row */}
                        <div className="mt-10 flex flex-wrap gap-4">
                            {[["Ideas", "500+"], ["Engineers", "1k+"], ["Implementations", "200+"]].map(([label, val]) => (
                                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-3">
                                    <p className="text-lg font-black text-emerald-400">{val}</p>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest">{label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── RIGHT panel — form ── */}
                {/*
                    Mobile  : full width, scrollable with top padding for navbar
                    md+     : fixed-width right column with left border separator
                */}
                <div className="
                    flex flex-col justify-center
                    w-full md:w-[420px] lg:w-[480px] xl:w-[520px] shrink-0
                    min-h-screen
                    px-5 sm:px-8 md:px-10 lg:px-12
                    pt-24 sm:pt-28 pb-12
                    bg-black/70 md:bg-black/80
                    backdrop-blur-xl
                    md:border-l border-white/8
                    shadow-2xl
                ">
                    <div className="w-full max-w-sm mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            {/* Mobile-only branding */}
                            <div className="md:hidden text-center mb-8">
                                <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400/30 bg-emerald-950/50 px-3 py-1.5 rounded-full mb-4">
                                    Join the Community
                                </span>
                                <h2 className="text-2xl font-black text-white">
                                    Architect{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                                        better systems.
                                    </span>
                                </h2>
                            </div>

                            {/* Form heading */}
                            <div className="mb-7 text-center md:text-left">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                                    Create an account
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    Join completely free and start exploring ideas today.
                                </p>
                            </div>

                            {/* Alerts */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-semibold">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 rounded-xl text-sm font-semibold">
                                    Registration successful! Redirecting to login...
                                </div>
                            )}

                            {/* Form */}
                            <form className="space-y-4" onSubmit={registerHandler}>
                                <div className="space-y-3">
                                    {/* Name */}
                                    <div className="group">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Alex Mercer"
                                            disabled={loading}
                                            className="w-full px-4 py-3.5 bg-slate-900/80 border border-white/8 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="group">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                            placeholder="hello@example.com"
                                            className="w-full px-4 py-3.5 bg-slate-900/80 border border-white/8 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="group">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                disabled={loading}
                                                className="w-full px-4 py-3.5 bg-slate-900/80 border border-white/8 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono tracking-widest pr-12 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-emerald-400 focus:outline-none transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                            6-20 chars · uppercase · lowercase · number · special character
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-3.5 font-extrabold text-black rounded-2xl transition-all text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] ${
                                            loading
                                                ? "bg-emerald-700 cursor-not-allowed opacity-70"
                                                : "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98]"
                                        }`}
                                    >
                                        {loading ? "Registering..." : "Complete Registration"}
                                    </button>
                                </div>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-500">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-bold text-white hover:text-emerald-400 transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-emerald-400/50"
                                >
                                    Log in instead
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;