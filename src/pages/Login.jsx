import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            const userRole = payload.role || ""; // ✅ NOW IT WORKS!

            if (userRole.includes("ADMIN")) {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative flex min-h-screen bg-slate-950 text-sans overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <img
                    src="/images/bg-view.png"
                    alt="DevPulse Background"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0" />
            </div>

            <div className="hidden lg:flex flex-col justify-center flex-1 relative z-10 p-12 lg:p-20 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="max-w-lg"
                >
                    <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400/30 bg-emerald-950/40 px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                        Welcome Back
                    </span>

                    <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
                        Build <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                            with confidence.
                        </span>
                    </h2>

                    <p className="text-slate-300 text-lg leading-relaxed drop-shadow-md">
                        Log in to continue exploring ideas, engineers, and scalable systems.
                    </p>
                </motion.div>
            </div>

            <div className="flex flex-col justify-center flex-[0.8] xl:flex-[0.7] w-full p-8 pt-32 sm:p-12 md:p-20 relative z-10 bg-black/85 backdrop-blur-xl border-l border-white/5 shadow-2xl">
                <div className="w-full max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
                                Login to your account
                            </h1>
                            <p className="text-slate-400 text-sm">
                                Enter your credentials to continue.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-semibold">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={loginHandler}>
                            <div className="space-y-4">
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
                                        className="w-full px-5 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-sans"
                                    />
                                </div>

                                <div className="group relative">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                        Password
                                    </label>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        placeholder="••••••••"
                                        className="w-full px-5 py-4 pr-14 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono tracking-widest"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-[42px] text-slate-400 hover:text-emerald-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-2xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </div>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-400">
                            Don't remember password? we got you.{" "}
                            <Link
                                to="/reset-password"
                                className="font-bold text-white hover:text-emerald-400 transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-emerald-400/50"
                            >
                                Reset it here
                            </Link>
                        </p>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Don’t have an account?{" "}
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
    );
};

export default Login;