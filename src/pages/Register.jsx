import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";



const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""

    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const registerHandler = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const API = import.meta.env.VITE_API_URL;

            const response = await axios.post(`${API}/api/users/register`, formData);

            setSuccess(true);

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {

            setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen bg-slate-950 text-sans overflow-hidden">

            {/* FULL-SCREEN IMAGE WITH BLEND */}
            {/* The slate-950 background + mix-blend-screen keeps the image colors rich and vibrant */}
            <div className="absolute inset-0 pointer-events-none">
                <img
                    src="/images/bg-view.png"
                    alt="DevPulse Background"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0" />
            </div>

            {/* LEFT SIDE - TEXT SHOWCASE */}
            <div className="hidden lg:flex flex-col justify-center flex-1 relative z-10 p-12 lg:p-20 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="max-w-lg"
                >
                    <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400/30 bg-emerald-950/40 px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                        Join the Community
                    </span>

                    <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
                        Architect <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">better systems.</span>
                    </h2>

                    <p className="text-slate-300 text-lg leading-relaxed drop-shadow-md">
                        Connect with engineers worldwide, share innovative ideas, and master backend scalability.
                    </p>
                </motion.div>
            </div>

            {/* RIGHT SIDE - REGISTRATION FORM */}
            {/* bg-black/85 gives a deep dark look with just a *slight* 15% view of the image underneath */}
            <div className="flex flex-col justify-center flex-[0.8] xl:flex-[0.7] w-full p-8 pt-32 sm:p-12 md:p-20 relative z-10 bg-black/85 backdrop-blur-xl border-l border-white/5 shadow-2xl">

                <div className="w-full max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Create an account</h1>
                            <p className="text-slate-400 text-sm">Join completely free and start exploring ideas today.</p>
                        </div>

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

                        <form className="space-y-5" onSubmit={registerHandler}>

                            <div className="space-y-4">
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
                                        className="w-full px-5 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-sans"
                                    />
                                </div>

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
                                            className="w-full px-5 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono tracking-widest pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-emerald-400 focus:outline-none transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 mt-2 font-extrabold text-black rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] ${loading ? 'bg-emerald-700 cursor-not-allowed opacity-70' : 'bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98]'}`}>
                                    {loading ? "Registering..." : "Complete Registration"}
                                </button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link to="/login" className="font-bold text-white hover:text-emerald-400 transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-emerald-400/50">
                                Log in instead
                            </Link>
                        </p>

                    </motion.div>
                </div>
            </div>

        </div>
    );
}

export default Register;