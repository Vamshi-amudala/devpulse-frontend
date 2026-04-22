import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError("Email and password are required");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const API = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${API}/api/users/login`, formData);
            const token = response.data.token || response.data;
            localStorage.setItem("token", token);
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
            );
            const payload = JSON.parse(jsonPayload);
            if ((payload.role || "").includes("ADMIN")) {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        /* ── Full-screen root ── */
        <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden">


            <div className="absolute inset-0 pointer-events-none z-0">
                <img
                    src="/images/bg-view.png"
                    alt="DevPulse Background"
                    className="w-full h-full object-cover mix-blend-screen opacity-40"
                />
                {/* gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row min-h-screen">

                <div className="hidden md:flex flex-col justify-center flex-1 px-10 lg:px-16 xl:px-24 pt-24 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="max-w-lg"
                    >
                        <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400/30 bg-emerald-950/40 px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                            Welcome Back
                        </span>

                        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
                            Build <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                                with confidence.
                            </span>
                        </h2>

                        <p className="text-slate-300 text-base lg:text-lg leading-relaxed drop-shadow-md">
                            Log in to continue exploring ideas, engineers, and scalable systems.
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
                                    Welcome Back
                                </span>
                                <h2 className="text-2xl font-black text-white">
                                    Build{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                                        with confidence.
                                    </span>
                                </h2>
                            </div>

                            {/* Form heading */}
                            <div className="mb-8 text-center md:text-left">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                                    Login to your account
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    Enter your credentials to continue.
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-semibold">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form className="space-y-5" onSubmit={loginHandler}>
                                <div className="space-y-4">
                                    <div className="group">
                                        <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                            placeholder="hello@example.com"
                                            className="w-full px-4 py-3.5 bg-slate-900/80 border border-white/8 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                                        />
                                    </div>

                                    <div className="group relative">
                                        <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                disabled={loading}
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3.5 pr-12 bg-slate-900/80 border border-white/8 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono tracking-widest text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 min-h-[44px] text-slate-400 hover:text-emerald-400 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 mt-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-2xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] text-sm"
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </button>
                                </div>
                            </form>

                            <p className="mt-5 text-center text-sm text-slate-400">
                                Don't remember password?{" "}
                                <Link
                                    to="/reset-password"
                                    className="font-bold text-white hover:text-emerald-400 transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-emerald-400/50"
                                >
                                    Reset it here
                                </Link>
                            </p>

                            <p className="mt-4 text-center text-sm text-slate-500">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-bold text-white hover:text-emerald-400 transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-emerald-400/50"
                                >
                                    Register instead
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default Login;